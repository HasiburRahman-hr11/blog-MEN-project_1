let commentHolder = document.getElementById('comment-holder');


commentHolder.addEventListener('keypress', (e) => {
    if (commentHolder.hasChildNodes(e.target)) {
        let value = e.target.value;
        if (e.key === 'Enter') {
            if (value) {
                let commentId = e.target.dataset.comment
                let data = {
                    body: e.target.value
                }

                let req = commentRequestHandler(`/api/comments/replies/${commentId}`, 'POST', data)

                fetch(req)
                    .then(res => res.json())
                    .then(data => {
                        let replyElement = createReplyHtml(data)
                        let parent = e.target.parentElement
                        parent.previousElementSibling.appendChild(replyElement);
                        e.target.value = ''
                    })
                    .catch(e => {
                        console.log(e);
                    })
            } else {
                alert('Please provide a valid reply!')
            }
        }
    }
})



let commentRequestHandler = (url, method, data) => {
    let headers = new Headers();
    headers.append('Accept', 'Application/JSON')
    headers.append('Content-Type', 'Application/JSON')

    let req = new Request(url, {
        method,
        headers,
        body: JSON.stringify(data),
        mode: 'cors'
    })

    return req;
}



let createReplyHtml = (reply) => {
    let replyHtml = `
    <div class="comment_avatar me-3">
        <img src="${reply.profilePics}" alt="">
    </div>
    <div class="reply_content text-start">
        <p class="comment_author fw-bold mb-2">${reply.username}</p>
        <p class="comment-body">${reply.body}</p>
        <p class="comment-time text-end mt-2 text-muted">
            <small>${new Date(reply.createdAt).toLocaleString() }</small>
        </p>
    </div>
    `

    let div = document.createElement('div')
    div.className = 'reply_item d-flex mt-3';
    div.innerHTML = replyHtml;

    return div;
}