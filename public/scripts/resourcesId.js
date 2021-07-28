// console.log("Hi i'm form Id");
// $(() => {
// $('div').css("color","blue")

// const createContainer = function(data) {
//     const {url, title, description, rating, comment} = data


//     const HTML = ` <div class="post-header"> post header
//     <div class="username-category">
//        Username: ${data.name} ------ Topic: ${data.topic}
//     </div>
// </div>
// <div>
//    Title:  ${item.title} <br>
//   URL:   ${item.url} <br>
//   Description:  ${item.description} <br>
// </div>

// <input type="text" placeholder="comment">
// <button>comment</button>
// <button>likes</button>
// <button>rates</button>
// </div>
// </section>
// <div class="rating">rating:  ${item.rating}</div>
// <div class="comment">comment:  ${item.comment}</div>
// `
//     return HTML;

// }

// const renderData = function(data) {

//     const $section = $("#resource-container");
//     $section.empty();

//     for (const data2 of data) {
//         const container = createContainer(data);
//         $section.append(container);
//     }
// }

// $.get('/:id')
// .then((res) => {
//     renderData(res);
// })

// $('#btn-comment').on('click', function() {
//     $.ajax({
//         url: "/comment",
//         type: "POST",
//         data: {'comment': $("#input").val() },
//         success: function(response) {
//             console.log(response);
//         }
//     }
//     )

// })



// })