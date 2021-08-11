const bookmarks = document.getElementsByClassName('bookmark')

;[...bookmarks].forEach(bookmark => {
    bookmark.style.cursor = 'pointer'

    bookmark.addEventListener('click' , (e)=>{
        let target = e.target.parentElement
        let postId = target.dataset.post
        
        let headers = new Headers()
        headers.append('Accept' , 'Application/JSON')
        headers.append('Content-Type' , 'Application/JSON')

        let req = new Request(`/api/bookmarks/${postId}` , {
            method: 'GET',
            headers,
            mode: 'cors'
        })

        fetch(req)
        .then(res => res.json())
        .then(data =>{
            if(data.bookmarked){
                target.innerHTML = '<i class="fas fa-bookmark text-primary" title="Remove from Bookmark"></i>'
            }else{
                target.innerHTML = '<i class="far fa-bookmark text-primary" title="Add to Bookmark"></i>'
            }
        })
        .catch(e => {
            console.log(e)
        })
    })
})