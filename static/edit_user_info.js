function enableEdit(modifyBtn, fieldName) {
  const infoValue = document.getElementById(fieldName);

  const old_val = infoValue.innerHTML

  infoValue.contentEditable = true;
  infoValue.style.background = 'rgba(0,0,0,0.1)';
  infoValue.classList.add('editable');
  infoValue.focus();

  modifyBtn.innerText = 'Validate';
  modifyBtn.onclick = function () {
    if (confirm('Are you sure you want to update this information?')) {
      // Perform the update logic here
      let newValue = infoValue.innerText;

      // Call a function to update the value in the database
      updateUserInfo(fieldName, newValue);

      infoValue.contentEditable = false;
      infoValue.style.background = 'transparent';
      infoValue.classList.remove('editable');
      modifyBtn.innerText = 'Update';
      modifyBtn.onclick = function () {
        enableEdit(modifyBtn, fieldName);
      };
      this.nextElementSibling.remove();

      getCurrentUserLogs();
    }
  };

  const cancelBtn = document.createElement('button');
  cancelBtn.innerText = 'Cancel';
  cancelBtn.onclick = function () {
    infoValue.contentEditable = false;
    infoValue.style.background = 'transparent';
    infoValue.classList.remove('editable');
    modifyBtn.innerText = 'Update';
    modifyBtn.onclick = function () {
      enableEdit(modifyBtn, fieldName);
    };
    infoValue.innerText = old_val; // Replace with the initial value from the database
    this.remove();
  };

  modifyBtn.insertAdjacentElement('afterend', cancelBtn);
}

function updateUserInfo(fieldName, newValue) 
{
    // Make an AJAX request to the server
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/update_user_info');
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  
    xhr.onload = function() {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        console.log(response.message);
      } else {
        alert('Failed to update user information.');
      }
    };
  
    xhr.onerror = function() {
      alert('Failed to update user information.');
    };
  
    const data = `field_name=${encodeURIComponent(fieldName)}&new_value=${encodeURIComponent(newValue)}`;
    xhr.send(data);
}
  