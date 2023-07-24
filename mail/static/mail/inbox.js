document.addEventListener('DOMContentLoaded', function() {

  // Selecting the buttons
  const inbox=document.querySelector('#inbox');
  const sent=document.querySelector('#sent');
  const archive=document.querySelector('#archive');
  const compose=document.querySelector('#compose');

  // Use buttons to toggle between views
  inbox.addEventListener('click', () => load_mailbox('inbox'));
  sent.addEventListener('click', () => load_mailbox('sent'));
  archive.addEventListener('click', () => load_mailbox('archive'));
  compose.addEventListener('click', compose_email);
  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  document.querySelector('#email').style.display = 'none';

  //Get the input fields
  const recipient=document.querySelector('#compose-recipients');
  const subject= document.querySelector('#compose-subject');
  const body=document.querySelector('#compose-body');
  const btn=document.querySelector('#btn');

// Clear out composition fields
  recipient.value = '';
  subject.value = '';
  body.value = '';
  console.log(compose.getAttribute('data-url'));
  // Add eventlistener for btn
  btn.addEventListener('click',(event)=>{
    //This prevents the default and lets handle the data manually
    event.preventDefault();
    
    //This send the data to the API
    fetch(compose.getAttribute('data-url'),{
      method: 'POST',
      body: JSON.stringify({
        recipients: recipient.value,
        subject: subject.value,
        body: body.value
      })
    })
    .then(response => response.json())
    .then(result =>{
      console.log(result)
    });
  });
}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#email').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
 
  //Getting the element that has our url
  var mail=document.querySelector(`#${mailbox}`);

  // Fetch data for the section
  fetch(mail.getAttribute('data-url'))
  .then(response=>response.json())
  .then(emails=>{
    console.log(emails);

    // Example: Render the emails in the mailbox view
    
    let emailsHtml= emails.map(email=>
      `
      <div class="mail" data-url="emails\\${email.id}" style="background-color:${email.read==true?'gray':'white'};">
      <span class="people"><strong>${mailbox=='sent'?email.recipients:email.sender}</strong></span>
      <span class="subject"> ${email.subject}</span>
      <span class="time"> ${email.timestamp}</span>
      </div>
      `).join('');
      console.log(emailsHtml);
      document.querySelector("#emails-view").innerHTML+=emailsHtml;
      document.querySelectorAll(".mail").forEach((element)=>{
        element.addEventListener('click',()=>{
         load_email(element.getAttribute("data-url"));
        });
       });
  });
  
  
}
function load_email(theurl){
 // Show the email and hide other views
 document.querySelector('#emails-view').style.display = 'none';
 document.querySelector('#compose-view').style.display = 'none';
 document.querySelector('#email').style.display = 'block';
 
 fetch(theurl)
 .then(response=>response.json())
 .then(email=>{
  console.log(email);
  let emailHtml=(`<div>
   <p><strong>From:</strong> ${email.sender}</p>
   <p><strong>To:</strong> ${email.recipients}</p>
   <p><strong>Subject:</strong> ${email.subject}</p>
   <p><strong>Body:</strong> ${email.body}</p>
   <p><strong>Time:</strong> ${email.timestamp}</p>
   <button id="reply-btn"onclick="reply_email('${email.sender}','${email.recipients}','${email.subject}','${email.body}', '${email.timestamp}')">Reply</button><button id="archive-btn" onclick="archive_email(${email.id},${email.archived})">${email.archived==true?'Unarchive':'Archive'}</button>
  </div>
  `);

  document.querySelector('#email').innerHTML=emailHtml;
 });
 fetch(theurl,{
  method:'PUT',
  body:JSON.stringify({
    read: true
  })
 });
}
function archive_email(theid,status){

 document.querySelector('#emails-view').style.display = 'block';
 document.querySelector('#compose-view').style.display = 'none';
 document.querySelector('#email').style.display = 'none';

if(status){
  fetch('emails/'+theid,{
    method:'PUT',
    body: JSON.stringify({
      archived: false
    })
   });
}
else{
  fetch('emails/'+theid,{
    method:'PUT',
    body: JSON.stringify({
      archived: true
    })
   });
}
}
function reply_email(sender,recipients,subject,body,timestamp){
  compose_email();

  document.querySelector('#compose-recipients').value=sender;
  document.querySelector('#compose-subject').value=(subject.startsWith("Re: ") ? subject :`Re: ${subject}`);
  document.querySelector('#compose-body').value=`On ${timestamp} ${sender} wrote: ${body}`;
}