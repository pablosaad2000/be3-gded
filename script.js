document.addEventListener('DOMContentLoaded', function () {
    const orderForm = document.getElementById('orderForm');
    const orderList = document.getElementById('orderList');
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');
    const editModal = document.getElementById('editModal');
    const viewModal = document.getElementById('viewModal');
    const orderDetails = document.getElementById('orderDetails');
    const saveChangesBtn = document.getElementById('saveChangesBtn');
    const closeButtons = document.querySelectorAll('.close');
    let orders = JSON.parse(localStorage.getItem('orders')) || [];
    let editingOrderIndex = -1;

    orderForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const order = {
            customerName: document.getElementById('customerName').value,
            orderNumber: document.getElementById('orderNumber').value,
            orderPrice: document.getElementById('orderPrice').value,
            orderType: document.getElementById('orderType').value,
            shippingCompany: document.getElementById('shippingCompany').value,
            orderAddress: document.getElementById('orderAddress').value,
            customerPhone: document.getElementById('customerPhone').value,
            orderDate: document.getElementById('orderDate').value
        };
        orders.push(order);
        saveOrdersToLocalStorage();
        updateOrderList();
        orderForm.reset();
    });

    searchInput.addEventListener('input', function () {
        const query = searchInput.value.toLowerCase();
        const filteredOrders = orders.filter(order =>
            order.customerName.toLowerCase().includes(query) ||
            order.orderNumber.includes(query) ||
            order.orderType.toLowerCase().includes(query)
        );
        displaySearchResults(filteredOrders);
    });

    function displaySearchResults(filteredOrders) {
        searchResults.innerHTML = '';
        filteredOrders.forEach((order, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <div>اسم العميل: ${order.customerName}</div>
                <div>رقم الطلب: ${order.orderNumber}</div>
                <div>نوع الطلب: ${order.orderType}</div>
                <button onclick="viewOrder(${index})">عرض التفاصيل</button>
            `;
            searchResults.appendChild(li);
        });
    }

    function updateOrderList() {
        orderList.innerHTML = '';
        orders.forEach((order, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <div>
                    <div>اسم العميل: ${order.customerName}</div>
                    <div>رقم الطلب: ${order.orderNumber}</div>
                    <div>سعر الطلب: ${order.orderPrice}</div>
                    <div>نوع الطلب: ${order.orderType}</div>
                    <div>شركة الشحن: ${order.shippingCompany}</div>
                    <div>عنوان الطلب: ${order.orderAddress}</div>
                    <div>رقم هاتف العميل: ${order.customerPhone}</div>
                    <div>تاريخ الطلب: ${order.orderDate}</div>
                </div>
                <div>
                    <button onclick="editOrder(${index})">تعديل</button>
                    <button onclick="deleteOrder(${index})">حذف</button>
                </div>
            `;
            orderList.appendChild(li);
        });
    }

    function saveOrdersToLocalStorage() {
        localStorage.setItem('orders', JSON.stringify(orders));
    }

    window.editOrder = function (index) {
        editingOrderIndex = index;
        const order = orders[index];
        document.getElementById('editCustomerName').value = order.customerName;
        document.getElementById('editOrderNumber').value = order.orderNumber;
        document.getElementById('editOrderPrice').value = order.orderPrice;
        document.getElementById('editDiscountedPrice').value = order.discountedPrice || '';
        document.getElementById('editOrderType').value = order.orderType;
        document.getElementById('editShippingCompany').value = order.shippingCompany;
        document.getElementById('editOrderAddress').value = order.orderAddress;
        document.getElementById('editCustomerPhone').value = order.customerPhone;
        document.getElementById('editOrderDate').value = order.orderDate;
        editModal.style.display = 'block';
    }

    window.deleteOrder = function (index) {
        orders.splice(index, 1);
        saveOrdersToLocalStorage();
        updateOrderList();
    }

    window.viewOrder = function (index) {
        const order = orders[index];
        orderDetails.innerHTML = `
            <p>اسم العميل: ${order.customerName}</p>
            <p>رقم الطلب: ${order.orderNumber}</p>
            <p>سعر الطلب: ${order.orderPrice}</p>
            <p>سعر بعد الخصم: ${order.discountedPrice || 'لا يوجد'}</p>
            <p>نوع الطلب: ${order.orderType}</p>
            <p>شركة الشحن: ${order.shippingCompany}</p>
            <p>عنوان الطلب: ${order.orderAddress}</p>
            <p>رقم هاتف العميل: ${order.customerPhone}</p>
            <p>تاريخ الطلب: ${order.orderDate}</p>
        `;
        viewModal.style.display = 'block';
    }

    saveChangesBtn.addEventListener('click', function () {
        const order = {
            customerName: document.getElementById('editCustomerName').value,
            orderNumber: document.getElementById('editOrderNumber').value,
            orderPrice: document.getElementById('editOrderPrice').value,
            discountedPrice: document.getElementById('editDiscountedPrice').value,
            orderType: document.getElementById('editOrderType').value,
            shippingCompany: document.getElementById('editShippingCompany').value,
            orderAddress: document.getElementById('editOrderAddress').value,
            customerPhone: document.getElementById('editCustomerPhone').value,
            orderDate: document.getElementById('editOrderDate').value
        };
        orders[editingOrderIndex] = order;
        saveOrdersToLocalStorage();
        updateOrderList();
        editModal.style.display = 'none';
    });

    closeButtons.forEach(button => {
        button.addEventListener('click', function () {
            editModal.style.display = 'none';
            viewModal.style.display = 'none';
        });
    });

    window.onclick = function (event) {
        if (event.target == editModal) {
            editModal.style.display = 'none';
        } else if (event.target == viewModal) {
            viewModal.style.display = 'none';
        }
    }

    updateOrderList();
});
