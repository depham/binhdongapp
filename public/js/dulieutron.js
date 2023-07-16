function updateTable(page, conditions) {
  //console.log(page);
  const url = `https://factory-binhdong.vercel.app/dulieutron/detailbycondition?page=${page}&${new URLSearchParams(conditions)}`;

    //console.log(page);
    fetch(url)
      .then(response => response.json())
      .then(data => {
        const result = data.result;
        //console.log(page);
        if (Array.isArray(result)) {
          const dataList = document.getElementById('dataList');
          dataList.innerHTML = "";
          result.forEach((item, index) => {
            // ...
            // Tạo các thẻ <td> và thêm dữ liệu vào bảng
            // ...
            const row = document.createElement('tr');

            const sCell = document.createElement('td');
            sCell.textContent = "";
            row.appendChild(sCell);

            // Cột STT
            const sttCell = document.createElement('td');
            sttCell.textContent = index + 1;
            row.appendChild(sttCell);

            // Cột ID
            const idCell = document.createElement('td');
            idCell.textContent = item.DuLieuTronID;
            row.appendChild(idCell);

            // Cột Giờ
            const timeCell = document.createElement('td');
            const dateObj = new Date(item.Time);
            dateObj.setHours(dateObj.getHours() - 7); // Điều chỉnh múi giờ theo GMT+7

            const hours = dateObj.getHours();
            //console.log(hours);
            const minutes = dateObj.getMinutes();
            const formattedTime = hours + ':' + (minutes < 10 ? '0' : '') + minutes + ' ' + (hours >= 12 ? 'PM' : 'AM');
            timeCell.textContent = formattedTime;
            row.appendChild(timeCell);

            // Cột Ngày
            const dateCell = document.createElement('td');
            const date = new Date(item.Date);
            const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
            const formattedDate = date.toLocaleDateString('en-GB', options); // 'en-GB' để đảm bảo định dạng ngày/tháng/năm là dd/MM/yyyy
            dateCell.textContent = formattedDate;
            row.appendChild(dateCell);
            
            // Cột MachineID
            const idMachineCell = document.createElement('td');
            idMachineCell.textContent = item.MachineID;
            row.appendChild(idMachineCell);

            // Cột TenHang
            const tenHangCell = document.createElement('td');
            tenHangCell.textContent = item.NameProduct;
            row.appendChild(tenHangCell);

            // Cột STTM
            const sttmCell = document.createElement('td');
            sttmCell.textContent = item.STTM;
            row.appendChild(sttmCell);

            // Cột M_CE1
            const m_Ce1Cell = document.createElement('td');
            m_Ce1Cell.textContent = item.M_CE1;
            row.appendChild(m_Ce1Cell);

            // Cột PV_CE1
            const pv_CE1Cell = document.createElement('td');
            pv_CE1Cell.textContent = item.PV_CE1;
            row.appendChild(pv_CE1Cell);

            // Cột M_CE2
            const m_Ce1Cel2 = document.createElement('td');
            m_Ce1Cel2.textContent = item.M_CE2;
            row.appendChild(m_Ce1Cel2);

            // Cột PV_CE2
            const pv_CE2Cell = document.createElement('td');
            pv_CE2Cell.textContent = item.PV_CE2;
            row.appendChild(pv_CE2Cell);

            // Cột M_CE3
            const m_Ce3Cell = document.createElement('td');
            m_Ce3Cell.textContent = item.M_CE3;
            row.appendChild(m_Ce3Cell);

            // Cột PV_CE3
            const pv_CE3Cell = document.createElement('td');
            pv_CE3Cell.textContent = item.PV_CE3;
            row.appendChild(pv_CE3Cell);

            // Cột PV_PG
            const pv_PGCell = document.createElement('td');
            pv_PGCell.textContent = item.PV_PG;
            row.appendChild(pv_PGCell);

            

            dataList.appendChild(row);
          });
        } else {
          console.error('Dữ liệu không phải là một mảng:', result);
        }
      })
      .catch(error => console.error(error))
  }
  
  // Gọi hàm updateTable với trang mặc định (page = 1) khi trang web được tải
  document.addEventListener('DOMContentLoaded', async () => {
    const perPage = 50; // Số dòng hiển thị trên mỗi trang
    const paginationList = document.getElementById('pagination-list');
    const defaultPage = 1;
  
    const conditions = getConditionsFromInputs(); // Lấy giá trị từ các trường input
    console.log(conditions);

    //Tổng vật tư

    const totalSupplies = await getTotalSupplies(conditions);
    getSupplies(totalSupplies);
    const totalSupplies_M_CE1 = await getTotalSupplies_M_CE1(conditions);
    getSupplies_M_CE1(totalSupplies_M_CE1);
    const totalSupplies_M_CE2 = await getTotalSupplies_M_CE2(conditions);
    getSupplies_M_CE2(totalSupplies_M_CE2);
    const totalSupplies_M_CE3 = await getTotalSupplies_M_CE3(conditions);
    getSupplies_M_CE3(totalSupplies_M_CE3);
    const totalSupplies_PV_CE1 = await getTotalSupplies_PV_CE1(conditions);
    getSupplies_PV_CE1(totalSupplies_PV_CE1);
    const totalSupplies_PV_CE2 = await getTotalSupplies_PV_CE2(conditions);
    getSupplies_PV_CE2(totalSupplies_PV_CE1);
    const totalSupplies_PV_CE3 = await getTotalSupplies_PV_CE3(conditions);
    getSupplies_PV_CE3(totalSupplies_PV_CE3);
    const totalSupplies_M_PG = await getTotalSupplies_M_PG(conditions);
    getSupplies_M_PG(totalSupplies_M_PG);

    // Lấy tổng số dòng dữ liệu
    const totalRows = await getTotalRows(conditions);
    const totalPages = Math.ceil(totalRows / perPage);
  
    // Tạo các liên kết trang
    createPageLinks(totalPages, defaultPage);
    // Thêm class 'active' cho trang mặc định
    const defaultLink = paginationList.querySelector(`[data-page="${defaultPage}"]`);
    defaultLink.classList.add('active');
  
    // Gọi hàm updateTable với trang mặc định
    updateTable(defaultPage, conditions);
  
    // Xử lý sự kiện click trên các liên kết trang
    paginationList.addEventListener('click', (event) => {
      const link = event.target.closest('.page-link');
      if (link) {
        const page = parseInt(link.getAttribute('data-page'));
        const conditions = getConditionsFromInputs();
        updateTable(page, conditions);
      }
    });

    var excelButton = document.getElementById("exportExcelBtn");
    excelButton.addEventListener("click", function(event) {
      const conditions = getConditionsFromInputs();
      handleExcel(event, conditions);
    });

    var excelSumButton = document.getElementById("exportExcelSumBtn");
    excelSumButton.addEventListener("click", function(event) {
      const conditions = getConditionsFromInputs();
      handleExcelSum(event, conditions);
    });

    var searchButton = document.getElementById("search-button");
    searchButton.addEventListener("click", function(event) {
      const conditions = getConditionsFromInputs();
      handleSearch(event, conditions);
    });
  });
  function getTotalSupplies(conditions) {
    const url = "https://factory-binhdong.vercel.app/dulieutron/totalsuppliesbycondition?" + new URLSearchParams(conditions);
  
    return fetch(url)
      .then(response => response.json())
      .then(data => {
        const totalRows = data.result;
        return totalRows;
      })
      .catch(error => {
        console.error('Lỗi khi lấy tổng số dòng dữ liệu:', error);
      });
    }

  function getTotalSupplies_M_CE1(conditions) {
    const url = "https://factory-binhdong.vercel.app/dulieutron/totalsuppliesmce1bycondition?" + new URLSearchParams(conditions);
  
    return fetch(url)
      .then(response => response.json())
      .then(data => {
        const totalSupplies = data.result;
        return totalSupplies;
      })
      .catch(error => {
        console.error('Lỗi khi lấy tổng số dòng dữ liệu:', error);
      });
  }

  function getTotalSupplies_M_CE2(conditions) {
    const url = "https://factory-binhdong.vercel.app/dulieutron/totalsuppliesmce2bycondition?" + new URLSearchParams(conditions);
  
    return fetch(url)
      .then(response => response.json())
      .then(data => {
        const totalSupplies = data.result;
        return totalSupplies;
      })
      .catch(error => {
        console.error('Lỗi khi lấy tổng số dòng dữ liệu:', error);
      });
  }

  function getTotalSupplies_M_CE3(conditions) {
    const url = "https://factory-binhdong.vercel.app/dulieutron/totalsuppliesmce3bycondition?" + new URLSearchParams(conditions);
  
    return fetch(url)
      .then(response => response.json())
      .then(data => {
        const totalSupplies = data.result;
        return totalSupplies;
      })
      .catch(error => {
        console.error('Lỗi khi lấy tổng số dòng dữ liệu:', error);
      });
  }

  function getTotalSupplies_PV_CE1(conditions) {
    const url = "https://factory-binhdong.vercel.app/dulieutron/totalsuppliespvce1bycondition?" + new URLSearchParams(conditions);
  
    return fetch(url)
      .then(response => response.json())
      .then(data => {
        const totalSupplies = data.result;
        return totalSupplies;
      })
      .catch(error => {
        console.error('Lỗi khi lấy tổng số dòng dữ liệu:', error);
      });
  }

  function getTotalSupplies_PV_CE2(conditions) {
    const url = "https://factory-binhdong.vercel.app/dulieutron/totalsuppliespvce2bycondition?" + new URLSearchParams(conditions);
  
    return fetch(url)
      .then(response => response.json())
      .then(data => {
        const totalSupplies = data.result;
        return totalSupplies;
      })
      .catch(error => {
        console.error('Lỗi khi lấy tổng số dòng dữ liệu:', error);
      });
  }

  function getTotalSupplies_PV_CE3(conditions) {
    const url = "https://factory-binhdong.vercel.app/dulieutron/totalsuppliespvce3bycondition?" + new URLSearchParams(conditions);
  
    return fetch(url)
      .then(response => response.json())
      .then(data => {
        const totalSupplies = data.result;
        return totalSupplies;
      })
      .catch(error => {
        console.error('Lỗi khi lấy tổng số dòng dữ liệu:', error);
      });
  }
  function getTotalSupplies_M_PG(conditions) {
    const url = "https://factory-binhdong.vercel.app/dulieutron/totalsuppliesmpgbycondition?" + new URLSearchParams(conditions);
  
    return fetch(url)
      .then(response => response.json())
      .then(data => {
        const totalSupplies = data.result;
        return totalSupplies;
      })
      .catch(error => {
        console.error('Lỗi khi lấy tổng số dòng dữ liệu:', error);
      });
  }
  function getTotalRows(conditions) {
    const url = "https://factory-binhdong.vercel.app/dulieutron/totalrowbycondition?" + new URLSearchParams(conditions);
  
    return fetch(url)
      .then(response => response.json())
      .then(data => {
        const totalRows = data.result;
        console.log(totalRows);
        return totalRows;
      })
      .catch(error => {
        console.error('Lỗi khi lấy tổng số dòng dữ liệu:', error);
      });
  }

// Lấy giá trị từ các trường input
function getConditionsFromInputs() {
  const selectedMachine = document.getElementById("machine-select").value;
  const fromDate = document.getElementById("from-date").value;
  const productName = document.getElementById("nameproduct-select").value;
  const toDate = document.getElementById("to-date").value;

  return {
    machine: selectedMachine,
    fromDate: fromDate,
    productName: productName,
    toDate: toDate
  };
}


function createPageLinks(totalPages, currentPage) {
  const paginationList = document.getElementById('pagination-list');
  paginationList.innerHTML = '';

  const visibleLinks = 6;
  const halfVisibleLinks = Math.floor(visibleLinks / 2);
  let startPage = currentPage - halfVisibleLinks;
  let endPage = currentPage + halfVisibleLinks;

  if (startPage < 1) {
    startPage = 1;
    endPage = visibleLinks;
  }

  if (endPage > totalPages) {
    endPage = totalPages;
    startPage = totalPages - visibleLinks + 1;
    if (startPage < 1) {
      startPage = 1;
    }
  }

  const prevItem = document.createElement('li');
  prevItem.classList.add('page-item');
  const prevLink = document.createElement('a');
  prevLink.classList.add('page-link');
  prevLink.setAttribute('href', '#');
  const prevIcon = document.createElement('span');
  prevIcon.classList.add('fas', 'fa-chevron-left'); // Sử dụng lớp 'oi' và 'oi-arrow-left' của Bootstrap để thêm biểu tượng mũi tên trái
  prevLink.appendChild(prevIcon);
  prevItem.appendChild(prevLink);
  paginationList.appendChild(prevItem);

  if (startPage > 1) {
    

    const ellipsisItem = document.createElement('li');
    ellipsisItem.classList.add('page-item');
    const ellipsisLink = document.createElement('a');
    ellipsisLink.classList.add('page-link');
    ellipsisLink.setAttribute('href', '#');
    ellipsisLink.textContent = '...';
    ellipsisItem.appendChild(ellipsisLink);
    paginationList.appendChild(ellipsisItem);
  }

  const links = [];

  for (let page = startPage; page <= endPage; page++) {
    const listItem = document.createElement('li');
    listItem.classList.add('page-item');
    const link = document.createElement('a');
    link.classList.add('page-link');
    link.setAttribute('href', '#');
    link.setAttribute('data-page', page);
    link.textContent = page;

    links.push(link);

    listItem.appendChild(link);
    paginationList.appendChild(listItem);
  }

  if (endPage < totalPages) {
    const ellipsisItem = document.createElement('li');
    ellipsisItem.classList.add('page-item');
    const ellipsisLink = document.createElement('a');
    ellipsisLink.classList.add('page-link');
    ellipsisLink.setAttribute('href', '#');
    ellipsisLink.textContent = '...';
    ellipsisItem.appendChild(ellipsisLink);
    paginationList.appendChild(ellipsisItem);

    
  }

  const nextItem = document.createElement('li');
  nextItem.classList.add('page-item');
  const nextLink = document.createElement('a');
  nextLink.classList.add('page-link');
  nextLink.setAttribute('href', '#');
  const nextIcon = document.createElement('span');
  nextIcon.classList.add('fas', 'fa-chevron-right'); // Sử dụng lớp 'oi' và 'oi-arrow-right' của Bootstrap để thêm biểu tượng mũi tên phải
  nextLink.appendChild(nextIcon);
  nextItem.appendChild(nextLink);
  paginationList.appendChild(nextItem);

  prevLink.addEventListener('click', function () {
    if (currentPage > 1) {
      createPageLinks(totalPages, currentPage - 1);

      // Lấy giá trị từ các trường input
      const conditions = getConditionsFromInputs();
      console.log(conditions);
      updateTable(currentPage - 1, conditions);
    }
  });

  nextLink.addEventListener('click', function () {
    if (currentPage < totalPages) {
      createPageLinks(totalPages, currentPage + 1);

      // Lấy giá trị từ các trường input
      const conditions = getConditionsFromInputs();
      console.log(conditions);
      updateTable(currentPage + 1, conditions);
    }
  });

  links.forEach(function (link) {
    link.addEventListener('click', function () {
      const selectedPage = parseInt(link.getAttribute('data-page'));
      createPageLinks(totalPages, selectedPage);

      // Lấy giá trị từ các trường input
      const conditions = getConditionsFromInputs();
      console.log(conditions);
      updateTable(selectedPage, conditions);

      links.forEach(function (l) {
        l.classList.remove('active');
      });

      link.classList.add('active');
    });
  });

  links[currentPage - startPage].classList.add('active');
}

function handleSearch(event) {
  event.preventDefault(); // Ngăn chặn hành vi mặc định của biểu mẫu

  const conditions = getConditionsFromInputs(); // Lấy giá trị từ các trường input

  getTotalRows(conditions)
    .then(totalRows => {
      const perPage = 50; // Số dòng hiển thị trên mỗi trang
      const totalPages = Math.ceil(totalRows / perPage);
      const defaultPage = 1;

      createPageLinks(totalPages, defaultPage);

      // Thêm class 'active' cho trang mặc định
      const defaultLink = document.querySelector(`[data-page="${defaultPage}"]`);
      defaultLink.classList.add('active');

      updateTable(defaultPage, conditions);

      const paginationList = document.getElementById('pagination-list');
      paginationList.addEventListener('click', (event) => {
        const link = event.target.closest('.page-link');
        if (link) {
          const page = parseInt(link.getAttribute('data-page'));
          const conditions = getConditionsFromInputs();
          updateTable(page, conditions);
        }
      });
    })
    .catch(error => {
      console.error('Lỗi khi lấy tổng số dòng dữ liệu:', error);
  });

  getTotalSupplies(conditions)
    .then(totalSupplies => {
      
      console.log(totalSupplies);
      
      // Thêm class 'active' cho trang mặc định
      
      getSupplies(totalSupplies);
      
    })
    .catch(error => {
      console.error('Lỗi khi lấy tổng số dòng dữ liệu:', error);
  });

  getTotalSupplies_M_CE1(conditions)
    .then(totalSupplies => {
      
      console.log(totalSupplies);
      
      // Thêm class 'active' cho trang mặc định
      
      getSupplies_M_CE1(totalSupplies);
      
    })
    .catch(error => {
      console.error('Lỗi khi lấy tổng số dòng dữ liệu:', error);
  });
  getTotalSupplies_M_CE2(conditions)
    .then(totalSupplies => {
      
      console.log(totalSupplies);
      
      // Thêm class 'active' cho trang mặc định
      
      getSupplies_M_CE2(totalSupplies);
      
    })
    .catch(error => {
      console.error('Lỗi khi lấy tổng số dòng dữ liệu:', error);
  });
  getTotalSupplies_M_CE3(conditions)
    .then(totalSupplies => {
      
      console.log(totalSupplies);
      
      // Thêm class 'active' cho trang mặc định
      
      getSupplies_M_CE3(totalSupplies);
      
    })
    .catch(error => {
      console.error('Lỗi khi lấy tổng số dòng dữ liệu:', error);
  });
  getTotalSupplies_PV_CE1(conditions)
    .then(totalSupplies => {
      
      console.log(totalSupplies);
      
      // Thêm class 'active' cho trang mặc định
      
      getSupplies_PV_CE1(totalSupplies);
      
    })
    .catch(error => {
      console.error('Lỗi khi lấy tổng số dòng dữ liệu:', error);
  });
  getTotalSupplies_PV_CE2(conditions)
    .then(totalSupplies => {
      
      console.log(totalSupplies);
      
      // Thêm class 'active' cho trang mặc định
      
      getSupplies_PV_CE2(totalSupplies);
      
    })
    .catch(error => {
      console.error('Lỗi khi lấy tổng số dòng dữ liệu:', error);
  });
  getTotalSupplies_PV_CE3(conditions)
    .then(totalSupplies => {
      
      console.log(totalSupplies);
      
      // Thêm class 'active' cho trang mặc định
      
      getSupplies_PV_CE3(totalSupplies);
      
    })
    .catch(error => {
      console.error('Lỗi khi lấy tổng số dòng dữ liệu:', error);
  });
  getTotalSupplies_M_PG(conditions)
    .then(totalSupplies => {
      
      console.log(totalSupplies);
      
      // Thêm class 'active' cho trang mặc định
      
      getSupplies_M_PG(totalSupplies);
      
    })
    .catch(error => {
      console.error('Lỗi khi lấy tổng số dòng dữ liệu:', error);
  });
}



function handleExcel(event, conditions) {
  event.preventDefault();
  console.log(conditions);
  const url = "https://factory-binhdong.vercel.app/dulieutron/exportexcel?" + new URLSearchParams(conditions).toString();

  fetch(url)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        console.log(data.callback);
        console.log(data.result);
        var serverFilePath = data.result;

        console.log("Exel");
      // Tạo liên kết tải xuống động với đường dẫn tệp tin Excel
        var link = document.createElement("a");
        link.href = serverFilePath;

      // Bắt đầu tải xuống
      link.click();

      
      })
      .catch(error => {
        console.error('Lỗi khi lấy Url:', error);
      });
   
}

function handleExcelSum(event, conditions) {
  event.preventDefault();
  console.log(conditions);
  const url = "https://factory-binhdong.vercel.app/dulieutron/exportexcelsum?" + new URLSearchParams(conditions).toString();

  fetch(url)
      .then(response => response.json())
      .then(data => {
        
        var serverFilePath = data.result;

        console.log("Sum");
      // Tạo liên kết tải xuống động với đường dẫn tệp tin Excel
        var link = document.createElement("a");
        link.href = serverFilePath;

      // Bắt đầu tải xuống
      link.click();

      
      })
      .catch(error => {
        console.error('Lỗi khi lấy Url:', error);
      });
   
}
function getSupplies(totalSupplies){
  var formattedTotalSupplies_M1 = Number(totalSupplies.M_CE1).toLocaleString();
  var formattedTotalSupplies_M2 = Number(totalSupplies.M_CE2).toLocaleString();
  document.getElementById('stats-M-CE1').textContent  = formattedTotalSupplies_M1;
  document.getElementById('stats-M-CE2').textContent  = formattedTotalSupplies_M2;
  //document.getElementById('stats-M-CE3').textContent  = formattedTotalSupplies.M_CE3;
}

function getSupplies_M_CE1(totalSupplies){
  var formattedTotalSupplies = Number(totalSupplies).toLocaleString();
  document.getElementById('stats-M-CE1').textContent  = formattedTotalSupplies
}
function getSupplies_M_CE2(totalSupplies){
  var formattedTotalSupplies = Number(totalSupplies).toLocaleString();
  document.getElementById('stats-M-CE2').textContent  = formattedTotalSupplies
}
function getSupplies_M_CE3(totalSupplies){
  var formattedTotalSupplies = Number(totalSupplies).toLocaleString();
  document.getElementById('stats-M-CE3').textContent  = formattedTotalSupplies
}
function getSupplies_PV_CE1(totalSupplies){
  var formattedTotalSupplies = Number(totalSupplies).toLocaleString();
  document.getElementById('stats-PV-CE1').textContent  = formattedTotalSupplies
}
function getSupplies_PV_CE2(totalSupplies){
  var formattedTotalSupplies = Number(totalSupplies).toLocaleString();
  document.getElementById('stats-PV-CE2').textContent  = formattedTotalSupplies
}
function getSupplies_PV_CE3(totalSupplies){
  var formattedTotalSupplies = Number(totalSupplies).toLocaleString();
  document.getElementById('stats-PV-CE3').textContent  = formattedTotalSupplies
}
function getSupplies_M_PG(totalSupplies){
  var formattedTotalSupplies = Number(totalSupplies).toLocaleString();
  document.getElementById('stats-M-PG').textContent  = formattedTotalSupplies
  document.getElementById('stats-PV-PG').textContent  = formattedTotalSupplies
}