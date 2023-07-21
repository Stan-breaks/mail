document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  //Get the input fields
  const recipent=document.querySelector('#compose-recipients')
  const subject= document.querySelector('#compose-subject')
  const body=document.querySelector('#compose-body')
  const btn=document.querySelector('#btn')

// Clear out composition fields
  recipent.value = '';
  subject.value = '';
  body.value = '';

  // Add eventlistener for btn
  btn.addEventListener('submit',()=>{

    //This send the data to the API
    fetch("{%url 'compose' %}",{
      method: 'POST',
      body: JSON.stringify({
        recipent: recipent.value,
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

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)} +stan</h3>`;

  //Fetch data for the section
  emails=fetch(`{%url 'mailbox' ${mailbox} %}`)
  .then(response=>response.json())
  .then(emails=>{
    console.log(emails);
  });
}