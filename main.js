import prodb, {
  bulkcreate,
  createEle,
  getData,
  SortObj
} from "./module.js";


let db = prodb("Productdb", {
  products: `id, uname, mail, pwd`
});

// input tags
const userid = document.getElementById("userid");
const uname = document.getElementById("uname");
const mail = document.getElementById("mail");
const pwd = document.getElementById("pwd");

// create button
const btncreate = document.getElementById("btn-create");
const btnread = document.getElementById("btn-read");
const btnupdate = document.getElementById("btn-update");
const btndelete = document.getElementById("btn-delete");


// user data

// event listerner for create button
btncreate.onclick = event => {
  // insert values
  let flag = bulkcreate(db.products, {
    uname: uname.value,
    mail: mail.value,
    pwd: pwd.value
  });
  // reset textbox values
  //proname.value = "";
  //seller.value = "";
  // price.value = "";
  uname.value = mail.value = pwd.value = "";

  // set id textbox value
  getData(db.products, data => {
    userid.value = data.id;
  });
  table();

  let insertmsg = document.querySelector(".insertmsg");
  getMsg(flag, insertmsg);
};

// event listerner for create button
btnread.onclick = read;



function read() {
  //request.onupgradeneeded = function(event) {
   // var db = event.target.result;
    //var objectStore = db.createObjectStore("products", {keyPath: "id"});
    
    //for (var i in tbody) {
      // objectStore.add(tbody[i]);
    //}
  //}
  var transaction = db.transaction(["products"]);
  var objectStore = transaction.objectStore("products");
  var request = objectStore.get("5");
  
  request.onerror = function(event) {
     alert("Unable to retrieve daa from database!");
  };
  
  request.onsuccess = function(event) {
    
     // Do something with the request.result!
     if(request.result) {
        alert("Name: " + request.result.uname + ", Mail: " + request.result.mail + ", Password: " + request.result.pwd);
     } else {
        alert("Kenny couldn't be found in your database!");
     }
  };
  
}
 

 
          

// button update
btnupdate.onclick = () => {
  const id = parseInt(userid.value || "");
  if (id) {
    // call dexie update method
    db.products.update(id, {
      uname: uname.value,
      mail: mail.value,
      pwd: pwd.value
    }).then((updated) => {
      // let get = updated ? `data updated` : `couldn't update data`;
      let get = updated ? true : false;

      // display message
      let updatemsg = document.querySelector(".updatemsg");
      getMsg(get, updatemsg);

      uname.value = mail.value = pwd.value = "";
      //console.log(get);
    })
  } else {
    console.log(`Please Select id: ${id}`);
  }
}

// delete button
btndelete.onclick = () => {
  db.delete();
  db = prodb("Productdb", {
    products: `id, uname, mail, pwd`
  });
  db.open();
  table();
  textID(userid);
  // display message
  let deletemsg = document.querySelector(".deletemsg");
  getMsg(true, deletemsg);
}

window.onload = event => {
  // set id textbox value
  textID(userid);
};




// create dynamic table
function table() {
  const tbody = document.getElementById("tbody");
  const notfound = document.getElementById("notfound");
  notfound.textContent = "";
  // remove all childs from the dom first
  while (tbody.hasChildNodes()) {
    tbody.removeChild(tbody.firstChild);
  }


  getData(db.products, (data, index) => {
    if (data) {
      createEle("tr", tbody, tr => {
        for (const value in data) {
          createEle("td", tr, td => {
            td.textContent = data.pwd === data[value] ? ` ${data[value]}` : data[value];
          });
        }
        createEle("td", tr, td => {
          createEle("i", td, i => {
            i.className += "fas fa-edit btnedit";
            i.setAttribute(`data-id`, data.id);
            // store number of edit buttons
            i.onclick = editbtn;
          });
        })
        createEle("td", tr, td => {
          createEle("i", td, i => {
            i.className += "fas fa-trash-alt btndelete";
            i.setAttribute(`data-id`, data.id);
            // store number of edit buttons
            i.onclick = deletebtn;
          });
        })
      });
    } else {
      notfound.textContent = "No record found in the database...!";
    }

  });
}

const editbtn = (event) => {
  let id = parseInt(event.target.dataset.id);
  db.products.get(id, function (data) {
    let newdata = SortObj(data);
    userid.value = newdata.id || "";
    uname.value = newdata.uname || "";
    mail.value = newdata.mail || "";
    pwd.value = newdata.pwd || "";
  });
}

// delete icon remove element 
const deletebtn = event => {
  let id = parseInt(event.target.dataset.id);
  db.products.delete(id);
  table();
}

// textbox id
function textID(textboxid) {
  getData(db.products, data => {
    textboxid.value = data.id;
  });
}

// function msg
function getMsg(flag, element) {
  if (flag) {
    // call msg 
    element.className += " movedown";

    setTimeout(() => {
      element.classList.forEach(classname => {
        classname == "movedown" ? undefined : element.classList.remove('movedown');
      })
    }, 4000);
  }
}