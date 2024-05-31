

const dataHTMLTable = document.getElementById("datatabell");
const selectSubject = document.getElementById("selectSubject");
const deleteSubject = document.getElementById("deleteSubject");

const selectSubjects = document.getElementById("selectSubjects");
const addSubject = document.getElementById("addSubject");



class User {
  constructor(id, username) {
  this.id = id;
  this.username = username;
  }
}




let users = null
let tasks = null
let familyPoints = null;
let done = null;
let thisUser = null




async function main() {
  
  await fetchData()
}


async function fetchData() {

  await fetchCurrentUser()
  await fetchSomeData()
  await fetchSubjects()

  };


document.addEventListener('DOMContentLoaded', main)



async function fetchCurrentUser() {
  try {
      const response = await fetch('/currentUser')
      
      let user = await response.json()
      thisUser = new User(user[0], user[1])
      console.log(thisUser)
  } catch (error) {
      console.log('Failed to fetch thusUser:', error);
  }
}

async function fetchSomeData() {
  try {
      const response = await fetch('/somedata/')
  
      let someData = await response.json()
      console.log(JSON.stringify(someData));
      showSomeData(someData);

  } catch (error) {
      console.log('Failed to fetch data:', error);
  }
}




function showSomeData(someData) {
    const table = document.createElement('table');
    let tableHtml = `<thead>
         <tr>
           <th>Fag</th>
           <th>Poeng</th>
         </tr>
      </thead>
      <tbody>`;

    for (let i = 0; i < someData.length; i++) {
         tableHtml += `<tr class="statRow" data-id="${someData[i].idFag}">
                <td>${someData[i].fag}</td>
                <td>${someData[i].points}</td>
                <td>
                </td>
            </tr>`;
     }

    table.innerHTML = tableHtml + '</tbody>';
    dataHTMLTable.innerHTML = "";
    dataHTMLTable.appendChild(table);

    selectSubject.innerHTML =""

    for (let i = 0; i < someData.length; i++) {
      const option = document.createElement("option");
      option.value = someData[i].idFag;
      option.textContent = someData[i].fag;

      selectSubject.appendChild(option)

    }
}
  

async function fetchSubjects() {
  try {
      const response = await fetch('/subjects')
  
      let subjects = await response.json()
      console.log(JSON.stringify(subjects));
      showSubjects(subjects);

  } catch (error) {
      console.log('Failed to fetch subjects:', error);
  }

}

function showSubjects(subjects) {
    selectSubjects.innerHTML = "";

    const existingSubjects = Array.from(selectSubject.options).map(option => option.value);

    for (let i = 0; i < subjects.length; i++) {
        if (!existingSubjects.includes(subjects[i].id.toString())) {
            const option = document.createElement("option");
            option.value = subjects[i].id;
            option.textContent = subjects[i].name;
            selectSubjects.appendChild(option);
        }
    }
}


document.getElementById('deleteSubject').addEventListener('click', function() {
  const selectSubject = document.getElementById('selectSubject');
  const userId = selectSubject.value;

  fetch('/removefag_user', {
      method: 'DELETE',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: userId }),
  })
  .then(response => {
      if (response.ok) {
          // Redirect to user list or confirmation page
          window.location.href = '/';
      } else {
          // Handle error
          console.error('Failed to delete user');
      }
  })
  .catch(error => {
      console.error('Error:', error);
  });
});












