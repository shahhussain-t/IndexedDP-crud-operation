import productdb, { bulkcreate, getData, createElm } from "./module.mjs";

let db = productdb("Productdb", {
  products: "++id,name,seller,price",
});

// input tags refernce

const userid = document.getElementById("userid");
const proname = document.getElementById("proname");
const seller = document.getElementById("seller");
const price = document.getElementById("price");

// btn referance

const btncreate = document.getElementById("btn-create");
const btnread = document.getElementById("btn-read");
const btnupdate = document.getElementById("btn-update");
const btndelete = document.getElementById("btn-delete");

// no record
const notfound = document.getElementById("notfound");

// console.log(userid,proname,seller,price,btncreate,btnread,btnupdate,btndelete)
// insert value create button

btncreate.onclick = (event) => {
  let flag = bulkcreate(db.products, {
    name: proname.value,
    seller: seller.value,
    price: price.value,
  });

  console.log(flag);
  //   proname.value="";
  //   seller.value="";
  //   price.value="";

  proname.value = seller.value = price.value = "";
  getData(db.products, (data) => {
    userid.value = data.id + 1 || 1;
  });

  table();
  let insertmsg = document.querySelector(".insertmsg");
  getMsg(flag, insertmsg);
};

// create event on btnread

btnread.onclick = table;

btnupdate.onclick = () => {
  const id = parseInt(userid.value || 0);

  if (id) {
    db.products
      .update(id, {
        name: proname.value,
        seller: seller.value,
        price: price.value,
      })
      .then((updated) => {
        let get = updated ? true : false;
        let updatemsg = document.querySelector(".updatemsg");
        getMsg(get, updatemsg);
      });
  }
};

// delete btn

btndelete.onclick = () => {
  db.delete();
  db = productdb("Productdb", {
    products: "++id,name,seller,price",
  });
  db.open();
  table();
  textID(userid);

  let deletemsg = document.querySelector(".deletemsg");
  getMsg(true, deletemsg);
};

window.onload = () => {
  textID(userid);
};

function textID(textboxid) {
  getData(db.products, (data) => {
    textboxid.value = data.id + 1 || 1;
  });
}

function table() {
  const tbody = document.getElementById("tbody");
  // let td=document.createElement("td");
  // console.log(td)
  // console.log(tbody)
  // tbody.appendChild(td)
  // createElm("td",tbody,(td)=>{

  //     console.log(td)
  //     console.log(tbody)

  // })
  while (tbody.hasChildNodes()) {
    tbody.removeChild(tbody.firstChild);
  }
  getData(db.products, (data) => {
    if (data) {
      createElm("tr", tbody, (tr) => {
        for (const value in data) {
          createElm("td", tr, (td) => {
            td.textContent =
              data.price === data[value] ? `$ ${data[value]}` : data[value];
          });
        }

        createElm("td", tr, (td) => {
          createElm("i", td, (i) => {
            i.className += "fas fa-edit btnedit";
            i.setAttribute(`data-id`, data.id);
            i.onclick = editbtn;
          });
        });

        createElm("td", tr, (td) => {
          createElm("i", td, (i) => {
            i.className += "fas fa-trash-alt btndelete";
            i.setAttribute(`data-id`, data.id);
            i.onclick = deletebtn;
          });
        });
      });
    } else if (!data) {
      notfound.textContent = "no record found";
    }
  });
}

function editbtn(event) {
  console.log(event.target.dataset.id);
  let id = parseInt(event.target.dataset.id);
  console.log(typeof id);
  db.products.get(id, (data) => {
    // console.log(data);
    (userid.value = data.id || 0),
      (proname.value = data.name || ""),
      (seller.value = data.seller || ""),
      (price.value = data.price || "");
  });
}

function deletebtn(event) {
  let id = parseInt(event.target.dataset.id);

  db.products.delete(id);
  table();
}

function getMsg(flag, element) {
  if (flag) {
    element.className += " movedown";
    setTimeout(() => {
      element.classList.forEach((classname) => {
        classname == "movedown"
          ? undefined
          : element.classList.remove("movedown");
      });
    }, 4000);
  }
}
