const productdb = (dbname, table) => {
  const db = new Dexie(dbname);
  db.version(1).stores(table);
  db.open();

  //   const db = new Dexie("myDb");

  //   db.version(1).stores({
  //     friends: "name,age",
  //   });
  return db;
};

// insert function

const bulkcreate = (dbtable, data) => {
  let flag = empty(data);
  if (flag) {
    dbtable.bulkAdd([data]);
    console.log("data inserted succesfully...!");
  } else {
    console.log("please provide data...!");
  }

  return flag;
};

// chexk text validation

const empty = (object) => {
  let flag = false;

  for (const value in object) {
    if (object[value] !== "" && object.hasOwnProperty(value)) {
      flag = true;
    } else {
      flag = false;
    }
  }
  return flag;
};

//get data from data base
const getData = (dbtable, fn) => {
  let index = 0;
  let obj = {};
  dbtable.count((count) => {
    if (count) {
      dbtable.each((table) => {
        obj = sortobj(table);
        fn(obj, index++);
      });
    } else {
      fn(0);
    }
  });
};

//sort object
const sortobj = (sortobj) => {
  let obj = {};
  obj = {
    id: sortobj.id,
    name: sortobj.name,
    seller: sortobj.seller,
    price: sortobj.price,
  };

  return obj;
};

// create element

const createElm = (tagname, appendTo, fn) => {
  const element = document.createElement(tagname);
  if (appendTo) appendTo.appendChild(element);
  if (fn) fn(element);
};

export default productdb;
export { bulkcreate, getData, createElm };
