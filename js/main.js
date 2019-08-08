(function(document, window) {
   'use strict';

   var gallery;
   var lastSearch = 'Nature';

   function searchPhotos(text, page) {
      if (text.length === 0) {
         alert('Error: the field is required');
      }
      page = page > 0 ? page : 1;
      var per_page = page == 1 ? 50 : 10;
      Flickr.searchText({
         text: text,
         per_page: per_page,
         jsoncallback: 'Website.Homepage.showPhotos',
         page: page
      });
   }

   function createPager(element, parameters) {
      var url = '/search/' + parameters.query + '/';
      element.textContent = '';

      var nextLink = document.createElement('a');
      nextLink = document.createElement('a');
      nextLink.href = url + (parameters.currentPage === parameters.pagesNumber ? parameters.pagesNumber : parameters.currentPage + 1);
      nextLink.innerHTML = '<span class="js-page-number">Load more</span>';
      element.appendChild(nextLink);      
   }

   function showPhotos(data) {
      createPager(
         document.getElementsByClassName('js-thumbnails__pager')[0], {
            query: lastSearch,
            currentPage: data.photos.page,
            pagesNumber: data.photos.pages
         }
      );
      gallery = new Gallery(data.photos.photo, document.getElementById('image-gallery-image'));
      gallery.createThumbnailsGallery(document.getElementsByClassName('js-thumbnails__list')[0]);
   }

   function init() {

      document.getElementsByClassName('js-thumbnails__pager')[0].addEventListener('click', function(event) {
         event.preventDefault();
         var page = 2;
         var currentLink = document.getElementById('current');
         if (currentLink == null) {
            currentLink= document.createElement('span');
            currentLink.id = 'current';
            currentLink.innerHTML = 2;
            document.getElementById('image-gallery-image').appendChild(currentLink);  

         } else {
            page = parseInt(currentLink.textContent) + 1;
            currentLink.innerHTML = page;
         }

         // Avoid reloading the same page
         if (page) {
            searchPhotos(lastSearch, page);
         }
      });

      // Kickstart the page
      searchPhotos(lastSearch, 1);
   }

   window.Website = Utility.extend(window.Website || {}, {
      Homepage: {
         init: init,
         showPhotos: showPhotos
      }
   });
})(document, window);

Website.Homepage.init();