const likeBtn = document.getElementById('likeBtn');
const disLikeBtn = document.getElementById('dislikeBtn');

likeBtn.addEventListener('click', () => {
    let postId = likeBtn.dataset.post;

    requestHandler('likes', postId)
        .then(res => res.json())
        .then(data => {
            let likeText = data.liked ? `<i class="fas fa-thumbs-up"></i> Liked (${data.totalLikes})` : `<i class="far fa-thumbs-up"></i> Like (${data.totalLikes})`;

            let dislikeText = `<i class="far fa-thumbs-down"></i> Disike (${data.totalDislikes})`;

            likeBtn.innerHTML = likeText;
            dislikeBtn.innerHTML = dislikeText;
        })
        .catch(e => {
            console.log(e);
        })
});


disLikeBtn.addEventListener('click' , () =>{
    let postId = disLikeBtn.dataset.post;

    requestHandler('dislikes' , postId)
    .then(res => res.json())
    .then(data => {
         let dislikeText = data.disliked ? `<i class="fas fa-thumbs-down"></i> Disiked (${data.totalDislikes})` : `<i class="far fa-thumbs-down"></i> Disike (${data.totalDislikes})`;

         let likeText = `<i class="far fa-thumbs-up"></i> Like (${data.totalLikes})`;

         disLikeBtn.innerHTML = dislikeText;
         likeBtn.innerHTML = likeText
    })
})

const requestHandler = (urlType, postId) => {
    let headers = new Headers();

    headers.append('Accept', 'Application/JSON');
    headers.append('Content-Type', 'Application/JSON');

    let req = new Request(`/api/${urlType}/${postId}`, {
        method: 'GET',
        headers,
        mode: 'cors'
    })

    return fetch(req)
}