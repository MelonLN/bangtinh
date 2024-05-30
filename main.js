document.addEventListener("DOMContentLoaded", function () {
    const addRowButton = document.getElementById("addRow");
    const addColumnButton = document.getElementById("addColumn");
    const deleteRowButton = document.getElementById("deleteRow");
    const deleteColumnButton = document.getElementById("deleteColumn");
    const addNewTableButton = document.getElementById("createNewTable");
    const tableContainer = document.getElementById("tableContainer");
    const calculateTotalButton = document.getElementById("calculateTotal");

    calculateTotalButton.addEventListener("click", () => calculateTotal("dynamicTable"));
    addRowButton.addEventListener("click", () => addRow("dynamicTable"));
    addColumnButton.addEventListener("click", () => addColumn("dynamicTable"));
    deleteRowButton.addEventListener("click", () => deleteRow("dynamicTable"));
    deleteColumnButton.addEventListener("click", () => deleteColumn("dynamicTable"));
    addNewTableButton.addEventListener("click", addNewTable);

    tableContainer.addEventListener("input", function(event) {
        const target = event.target;
        if (target.tagName === "INPUT" || target.tagName === "TD") {
            const tableId = target.closest("table").id;
            updateTotals(tableId);
        }
    });

    function addRow(tableId) {
        const table = document.getElementById(tableId);
        const rowCount = table.querySelectorAll("tbody tr").length;
        const newRow = document.createElement("tr");
        newRow.innerHTML = `
            <th>Hàng ${rowCount + 1}</th>
            ${createCells(table)}
        `;
        table.querySelector('tbody').appendChild(newRow);
        updateTotals(tableId);
    }

    function createCells(table) {
        const columnCount = table.querySelectorAll("thead th").length - 1;
        let cellHTML = '';
        for (let i = 0; i < columnCount; i++) {
            cellHTML += `<td><input type="number" class="column${i + 1}"></td>`;
        }
        return cellHTML;
    }

    function addColumn(tableId) {
        const table = document.getElementById(tableId);
        const columnCount = table.querySelectorAll("thead th").length - 1;
        const newColumnHeader = document.createElement("th");
        newColumnHeader.textContent = `Cột ${columnCount + 1}`;
        table.querySelector("thead tr").appendChild(newColumnHeader);
    
        table.querySelectorAll("tbody tr").forEach((row, rowIndex) => {
            const newColumn = document.createElement("td");
            newColumn.innerHTML = `<input type="number" class="column${columnCount + 1}" row-index="${rowIndex}">`;
            row.appendChild(newColumn);
        });
        addTotalColumn(table, columnCount + 1);
        updateTotals(tableId);
    }    

    function deleteRow(tableId) {
        const table = document.getElementById(tableId);
        const tbody = table.querySelector("tbody");
        if (tbody.childElementCount > 1) {
            tbody.removeChild(tbody.lastElementChild);
            updateTotals(tableId);
        }
    }

    function deleteColumn(tableId) {
        const table = document.getElementById(tableId);
        const headerCells = table.querySelectorAll("thead th");
        if (headerCells.length > 2) {
            headerCells[headerCells.length - 1].remove();
            table.querySelectorAll("tbody tr").forEach(row => {
                row.removeChild(row.lastElementChild);
            });
            table.querySelector("tfoot tr").removeChild(table.querySelector("tfoot tr").lastElementChild);
            updateTotals(tableId);
        }
    }

    function addNewTable() {
        const tableId = 'table' + (document.querySelectorAll('table').length + 1);
        const tableId2 = (document.querySelectorAll('table').length + 1);
        const newTable = document.createElement("div");
        newTable.innerHTML = `
        <div id="${tableId}Container">
            <div class="button-container">
                <p>Bảng ${tableId2}</p>
                <button class="button addRow">Thêm hàng</button>
                <button class="button addColumn">Thêm cột</button>
                <button class="button deleteRow">Xoá hàng</button>
                <button class="button deleteColumn">Xoá cột</button>
            </div>
            <table id="${tableId}" class="dynamicTable">
                <thead>
                    <tr>
                        <th></th>
                        <th>Cột 1</th>
                        <th>Cột 2</th>
                        <th>Cột 3</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th>Hàng 1</th>
                        <td><input type="number" class="column1"></td>
                        <td><input type="number" class="column2"></td>
                        <td><input type="number" class="column3"></td>
                    </tr>
                </tbody>
                <tfoot>
                    <tr>
                        <th>Tổng</th>
                        <td class="total1"></td>
                        <td class="total2"></td>
                        <td class="total3"></td>
                    </tr>
                </tfoot>
            </table>
            <div class="totalResult" id="total${tableId}">Kết quả: 0</div>
            <button class="button calculateTotal">Tính toán</button>
        </div>
        `;
        tableContainer.appendChild(newTable);

        const newTableDiv = document.getElementById(`${tableId}Container`);
        const table = newTableDiv.querySelector('.dynamicTable');

        newTableDiv.querySelector('.addRow').addEventListener('click', function () {
            addRow(tableId);
        });
        newTableDiv.querySelector('.addColumn').addEventListener('click', function () {
            addColumn(tableId);
        });
        newTableDiv.querySelector('.deleteRow').addEventListener('click', function () {
            deleteRow(tableId);
        });
        newTableDiv.querySelector('.deleteColumn').addEventListener('click', function () {
            deleteColumn(tableId);
        });
        newTableDiv.querySelector('.calculateTotal').addEventListener('click', function () {
            calculateTotal(tableId);
        });

        updateTotals(tableId);
    }

    function updateTotals(tableId) {
        const table = document.getElementById(tableId);
        const columnCount = table.querySelectorAll("th").length - 1;
        for (let i = 1; i <= columnCount; i++) {
            let total = 0;
            const columnValues = table.querySelectorAll(`.column${i}`);
            columnValues.forEach(input => {
                total += parseInt(input.value) || 0;
            });
            table.querySelector(`tfoot td.total${i}`).textContent = total;
        }
    }

    function addTotalColumn(table, columnIndex) {
        const totalColumn = document.createElement("td");
        totalColumn.classList.add(`total${columnIndex}`);
        table.querySelector("tfoot tr").appendChild(totalColumn);
    }

    function calculateTotal(tableId) {
        const table = document.getElementById(tableId);
        const totalCells = table.querySelectorAll('tfoot td');
        let sum = 0;
        totalCells.forEach(cell => {
            sum += parseInt(cell.textContent) || 0;
        });
        document.getElementById(`total${tableId}`).innerText = `Kết quả: ${sum}`;
    }
});
