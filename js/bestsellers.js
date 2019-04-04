var url = 'https://api.nytimes.com/svc/books/v3/lists.json?list-name=hardcover-fiction&api-key=aJoby9KZYue28hJf70no3n5GXdwxbYj1';

// console.log(url)

$.ajax({
url: url,
success: function(result){
result.results.forEach(function(book){
	var isbn = book.isbns[1].isbn10;
	var bookInfo = book.book_details[0];
    var lastweek = book.rank_last_week || 'n/a';
    var weeks = book.weeks_on_list || 'New this week';
	console.log(isbn)
	var title = book.book_details[0].title;
	var author = book.book_details[0].author;
	var desc = book.book_details[0].description;
	var rank = book.rank;

var listing = 
  '<div id="' + book.rank + '" class="entry">' + 
  	'<p class="rank">' + book.rank + '</p>' +
    '<p>' + 
      '<img src="" class="book-cover" id="cover-' + book.rank + '">' + 
    '</p>' + 
    '<h2><a href="' + book.amazon_product_url + '" target="_blank">' + bookInfo.title + '</a></h2>' +
    '<h4>By ' + bookInfo.author + '</h4>' +
    '<h4 class="publisher">' + bookInfo.publisher + '</h4>' +
    '<p>' + bookInfo.description + '</p>' + 
    '<div class="stats">' +
      '<hr>' + 
      '<p>Last Week: ' + lastweek + '</p>' + 
      '<p>Weeks on list: ' + weeks + '</p>' +
    '</div>' +
  '</div>';
$('#best-seller-titles').append(listing);
$('#' + book.rank).attr('nyt-rank', book.rank);

    updateCover(book.rank, isbn);
})
}
});

function updateCover(id, isbn) {
  fetch('https://www.googleapis.com/books/v1/volumes?q=isbn:' + isbn + "&key=AIzaSyDQPl9DRXKSaKpLo8E-E9SFC8htrW_10NY", {
    method: 'get'
  })
  .then(response => { return response.json(); })
  .then(data => {
    var img = data.items[0].volumeInfo.imageLinks.thumbnail;
    img = img.replace(/^http:\/\//i, 'https://');
    $('#cover-' + id).attr('src', img);
  })
  .catch(error => {
    console.log(error);
    console.log('Googel API Error: Defaulting to archival images for book #' + id + ' ISBN: ' + isbn);
    var index = id - 1;
    var img = archivedImages[index];
    $('#cover-' + id).attr('src', img);
  });
}

$(window).scroll(function (event) {
    var scroll = $(window).scrollTop();
    if (scroll > 50) {
      $('#masthead').css({'height':'50', 'padding' : '8'})
      $('#nyt-logo').css({'height':'35'})
    } else {
      $('#masthead').css({'height':'100', 'padding':'10'});
      $('#nyt-logo').css({'height':'80'})
    }
});

