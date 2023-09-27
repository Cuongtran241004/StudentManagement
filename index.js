// constructor function và kế thừa bằng prototype
// quản lý sinh viên
function Student(name, birthday) {
  this.name = name;
  this.birthday = birthday;
  this.id = new Date().toISOString();
}

// ------------------------------------------------------ Store ----------------------------------------------------
function Store() {}
// getStudents: lấy danh sách sinh viên từ localStorage
Store.prototype.getStudents = function () {
  return JSON.parse(localStorage.getItem("students")) || [];
};

// "add" thêm student mới vào localStorage
Store.prototype.add = function (newStudent) {
  // B1. lấy danh sách từ localStorage
  const students = this.getStudents();
  // B2. Thêm data mới vào
  students.push(newStudent);
  // B3. Cập nhật lại danh sách
  localStorage.setItem("students", JSON.stringify(students));
};

// getStudent(): hàm nhận vào id, tìm sinh viên sở hữu id đó
Store.prototype.getStudent = function (id) {
  // lấy danh sách sinh viên
  const students = this.getStudents();
  return students.find((student) => student.id == id);
};

// remove: nhận vào id sinh viên, tìm sinh viên và xóa sinh viên khỏi localStorage
Store.prototype.remove = function (id) {
  const students = this.getStudents();
  const indexRemove = students.findIndex((student) => student.id == id);
  students.splice(indexRemove, 1); // tìm vị trí và xóa 1 phần tử
  // cập nhật lại localStorage
  localStorage.setItem("students", JSON.stringify(students));
};

//-------------------------------------------------- RenderUI --------------------------------------------------
function RenderUI() {}
// add: thêm student mới vào giao diện
RenderUI.prototype.add = function (newStudent) {
  // B1. lấy danh sách students (để biết được số thứ tự)
  const students = new Store().getStudents();
  const { name, birthday, id } = newStudent; // destructuring
  const newTr = document.createElement("tr");
  newTr.innerHTML = `
  <td>${students.length}</td>
  <td>${name}</td>
  <td>${birthday}</td>
  <td>
      <button class="btn btn-danger btn-sm btn-remove" data-id="${id}">Xóa</button>
  </td>
  `;
  document.querySelector("tbody").appendChild(newTr);
  // xóa giá trị của input
  document.querySelector("#name").value = "";
  document.querySelector("#birthday").value = "";
};

// alert: nhận vào msg và type (màu success, info, danger)
// type = "success" // màu mặc định
RenderUI.prototype.alert = function (msg, type = "success") {
  // tạo div thông báo
  const divAlert = document.createElement("div");
  // thêm class cho nó
  divAlert.className = `alert alert-${type}`;
  divAlert.innerHTML = msg;

  // nhét vào div thông báo hiển thị
  document.querySelector("#notification").appendChild(divAlert);

  // sau 2s thì xóa thông báo
  setTimeout(() => {
    divAlert.remove();
  }, 2000);
};

// renderAll
RenderUI.prototype.renderAll = function () {
  //B1. lấy danh sách students
  const students = new Store().getStudents();

  //B2. hiển thị từng sinh viên
  const htmlContent = students.reduce(
    (total, currentStudent, indexCurrentStudent) => {
      return (
        total +
        `
      <tr>
      <td>${indexCurrentStudent + 1}</td>
      <td>${currentStudent.name}</td>
      <td>${currentStudent.birthday}</td>
      <td>
          <button class="btn btn-danger btn-sm btn-remove" data-id="${
            currentStudent.id
          }">Xóa</button>
      </td>
  </tr>
      `
      );
    },
    ""
  );
  //nhét hết nội dung vào tbody
  document.querySelector("tbody").innerHTML = htmlContent;
};

// Sự kiện submit form thêm student
document.querySelector("form").addEventListener("submit", (event) => {
  event.preventDefault(); // chặn reset trang
  const name = document.querySelector("#name").value;
  const birthday = document.querySelector("#birthday").value;
  const newStudent = new Student(name, birthday);
  const store = new Store();
  const ui = new RenderUI();

  // Lưu student mới vào localStorage
  store.add(newStudent);
  // Hiển thị student mới lên giao diện
  ui.add(newStudent);
  // Thông báo add thành công
  ui.alert(`Bạn vừa thêm thành công ${name}`);
});
// sự kiện khi trang web vừa load xong
// Viết hàm renderAll để render ra tất cả những gì có trong students
// Mục đích: lấy danh sách sinh viên từ localstorage và render từng sinh viên dưới dạng table
// DOMContentLoaded: ngay sau khi trang web vừa mới load xong
document.addEventListener("DOMContentLoaded", (event) => {
  const ui = new RenderUI();
  ui.renderAll();
});

// để tbody lắng nghe sự kiện click() vì tbody là dom thật
// nếu để nút "xóa" lắng nghe sự kiện thì khi thêm student vào thì nó bị vô hiệu hóa
document.querySelector("tbody").addEventListener("click", (event) => {
  // nếu đang click mà click vào node có class btn-remove thì tiến hành xóa
  if (event.target.classList.contains("btn-remove")) {
    //1. lấy data-id của nút vừa click để có id tìm student và xóa
    const idRemove = event.target.dataset.id; // lấy data-id của nút xóa
    let store = new Store();
    let ui = new RenderUI();
    // từ idRemove tìm student
    let student = store.getStudent(idRemove);
    // xin confirm trước khi xóa
    let isConfirmed = confirm(`Bạn có chắc là muốn xóa ${student.name} không?`);
    if (isConfirmed) {
      store.remove(idRemove);
      ui.renderAll();
      ui.alert(`Bạn đã xóa ${student.name} thành công!`, "success");
    }
  }
});
