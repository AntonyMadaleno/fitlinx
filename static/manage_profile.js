let menu_state = false;

function openProfileMenu(btn)
{
    if (menu_state == false)
    {
        menu_state = true;
        btn.style.color = '#ff5050';
    }

    else
    {
        menu_state = false;
        btn.style.color = '#f5f5f5'
    }
    
}

function addFriend(name) {
    // Construct the URL with the target name as a query parameter
    const url = `/add_friend?name=${encodeURIComponent(name)}`;
  
    // Send the GET request
    fetch(url)
        .then(response => {
            if (response.ok) 
            {
                // Request successful
                console.log('Friend added successfully');
            } 
            else 
            {
                // Request failed
                console.error('Failed to add friend');
            }
        })

        .catch(error => {
            // Request failed
            console.error('Failed to add friend', error);
        });
}