// $(() => {
//   $.ajax({
//     method: "GET",
//     url: "/api/users"
//   }).done((users) => {
//     for(user of users) {
//       $("<div>").text(user.name).appendTo($("body"));
//     }
//   });;
// });


//$(document).ready(() => {});

$(() => {
  // make a GET request to `/api/resources/:id`
  // var params = new window.URLSearchParams(window.location.search);
  // console.log("resourceID:", resourceID);
  // console.log("window.location:", window.location);
  const createComment = function(data) {
    const {name, topic, comments} = data;
    let $comment = `
  <article class="tweets">
    <header class="tweets-header">
      <div class="tweets-header-left">
        <span>${name}</span>
      </div>
      <div class="category">
      <span>${topic}</span>
      </div>
    </header>
    <div class="text">${comments}</div>
  </article>
  `;
    return $comment;
  };

  const renderComments = (data) => {
    const $commentContainer = $('.comments-list')
    $commentContainer.empty();
    for (const item of data) {
      const $comment = createComment(item);
      $commentContainer.prepend($comment);
    }
  }

  const $likeButton = $('#like');
  $likeButton.click((event) => {
    console.log("like handler");
    event.preventDefault();
    const data = $likeButton.serialize();
    const resourceID = window.location.pathname.substr(15, window.location.pathname.length - 15)
    $.post(`/api/resources/${resourceID}/like`, data)
      .then(() => {
        console.log('all done');
        //fetchComments(); //==>should fetch the whole page
      });
  })

  const $formRate = $('#rate-input')
  $formRate.submit((event) => {
    event.preventDefault();
    const data = $formRate.serialize();
    const resourceID = window.location.pathname.substr(15, window.location.pathname.length - 15)
    $.post(`/api/resources/${resourceID}/rate`, data)
      .then((data) => {

        console.log("data after add rate:", data);

        fetchComments();
      });
  })
  //create form
  //create event handler
  //check post route (into db)
  const $formComment = $('#comment-input')
  $formComment.submit((event) => {
    event.preventDefault();
    const data = $formComment.serialize();
    const resourceID = window.location.pathname.substr(15, window.location.pathname.length - 15)
    $.post(`/api/resources/fetch/${resourceID}`, data)
      .then(() => {
        console.log('all done');
        fetchComments();
      });
  })

  const fetchComments = () => {
    const resourceID = window.location.pathname.substr(15, window.location.pathname.length - 15)
    // $.get(`/api/resources/fetch/${resourceID}`)
    $.get(`/api/resources/${resourceID}/comment`)
      .then((data) => {
        console.log(data);
        renderComments(data);
      })
  }

  fetchComments();

});
