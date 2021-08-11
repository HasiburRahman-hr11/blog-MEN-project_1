window.onload = function(){

    $('#profilePicsFile').on('change' , ()=>{

        let file = document.getElementById('profilePicsFile').files[0]
        console.log(file)


        let reader = new FileReader();
        reader.readAsArrayBuffer(file);
        reader.onload = function(){
            
            
            let formData = new FormData()

            formData.append('profilePics', file)

            let headers = new Headers();
            headers.append('Accept' , 'Application/JSON')
            let req = new Request('/uploads/profilePics' , {
                method: 'POST',
                headers,
                mode: 'cors',
                body: formData
            })

            fetch(req)
            .then(res => res.json())
            .then(data => {
                document.getElementById('removeProfilePics').style.display = 'block';
                document.getElementById('profilePics').src = data.profilePics;
                document.getElementById('profilePicsForm').reset();
            })
            .catch(e=>{
                console.log(e)
            })
        }
        
    });

    $('#removeProfilePics').on('click' , ()=>{

        let req = new Request('/uploads/profilePics' , {
            method: 'DELETE',
            mode: 'cors'
        })

        fetch(req)
        .then(res => res.json())
        .then(data => {
            document.getElementById('removeProfilePics').style.display = 'none';
            document.getElementById('profilePics').src = data.profilePics;
            document.getElementById('profilePicsForm').reset();
        })
        .catch(e=>{
            console.log(e);
            alert('Server Error!')
        })

    })


    
}
