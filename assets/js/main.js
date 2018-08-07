$(function () {
  $('#new-product-modal').on('hidden.bs.modal', () => {
    $('.js-save-btn').off('click');
    clearModal('prod-mngment-form');
  });

  $('[data-role="text-editor"]').summernote({
    lang: 'ru-RU',
    minHeight: 100,
    toolbar: [
      ['style', ['bold', 'italic', 'underline', 'clear']],
      ['font', ['strikethrough', 'superscript', 'subscript']],
      ['fontsize', ['fontsize']],
      ['color', ['color']],
      ['para', ['ul', 'ol', 'paragraph']],
      ['height', ['height']],
      ['misc', ['link', 'fullscreen']]
    ],
    popover: {
      image: [
        ['imagesize', ['imageSize100', 'imageSize50', 'imageSize25']],
        ['float', ['floatLeft', 'floatRight', 'floatNone']],
        ['remove', ['removeMedia']]
      ]
    }
  });

  lookForServerMessage();


  $('input[name="phone"]').mask('+7(000) 000-00-00', {
    placeholder: "Телефон*: +7(___)___-__-__"
  });

  const feedbackCloseBtn = document.querySelector('.js-feedback-close');
  const feedbackCheckbox = document.querySelectorAll('.form__checkbox');
  const uploadImgBtn = document.querySelectorAll('.js-upload-pic');

  if (feedbackCloseBtn) {
    feedbackCloseBtn.addEventListener('click', closeFeedbackForm);
  }

  if (feedbackCheckbox && feedbackCheckbox.length > 0) {
    feedbackCheckbox.forEach(el => el.addEventListener('change', (e) => {
      e.target.closest('.feedback__rules').classList.remove('error');
    }))
  }

  if (uploadImgBtn && uploadImgBtn.length > 0) {
    uploadImgBtn.forEach(btn => {
      const root = btn.closest('.form__prod-img')
      const fileInput = root.querySelector('[name="image"]');
      const img = root.querySelector('img');

      btn.addEventListener('click', (event) => {
        event.preventDefault();

        fileInput.click();
      });

      fileInput.addEventListener('change', () => {
        if (fileInput.files && fileInput.files[0]) {
          const reader = new FileReader();

          reader.onload = (e) => {
            img.src = e.target.result;
          }

          reader.readAsDataURL(fileInput.files[0]);
        }
      });
    });
  }

  $('input').focus(function (e) {
    if ($(this).hasClass('error')) $(this).removeClass('error');
  });
  $('textarea').focus(function (e) {
    if ($(this).hasClass('error')) $(this).removeClass('error');
  });

  $('.js-open-feedback').click((e) => {
    e.preventDefault();

    openFeedbackForm();
  });

  $('.js-edit-product-modul-open').click(async (e) => {
    e.preventDefault();

    const url = e.currentTarget.attributes.onclick.value;

    // need to request data for edit modal window
    // clear all fields after edit modal window will be closed

    try {
      const response = await fetch(url);

      if (response.ok) {
        product = await response.json();

        const modal = $('#edit-product-modal');
        const form = modal.find('form');
        const selectCategories = modal.find('[name="category"] option');

        form.attr(`action`, `/products/edit/${product._id}?_method=PUT`);
        modal.find('.form_img').attr('src', product.img);
        modal.find('[name="prod_name"]').val(product.title);
        modal.find('[name="subtitle"]').val(product.subtitle);
        modal.find('[name="prod_description"]').text(product.description);

        $.each(product.modifications, (key, val) => {
          const price = modal.find(`[name="mod-${key}-price"]`);
          const description = modal.find(`[name="mod-${key}-description"]`);

          price.val(val.price);
          description.summernote('code', val.description);
        });

        selectCategories.each((i) => {
          selectCategories[i].value == product.category._id ?
            $(selectCategories[i]).attr('selected', 'selected') : '';
        });

        modal.modal('show');
      }
    } catch (ex) {
      console.log(ex)
    }

  });

  document.querySelectorAll('.js-remove-product').forEach(el => {
    el.addEventListener('click', async (e) => {
      e.preventDefault();

      const target = e.currentTarget;
      const url = target.attributes.onclick.value;
      const row = $(target.form.parentElement);
      const name = row.find('td')[1].innerText;

      try {
        const response = await fetch(url, {
          method: 'DELETE'
        });

        if (response.ok) {
          // const data = response.json(); //do I need it?

          row.fadeOut(500, () => {
            row.remove();

            Lobibox.notify('warning', {
              msg: `Продукт ${name} был удален`,
              closable: true,
              delay: 5000,
              sound: 'sound6',
              position: "bottom right"
            });
          });
        } else {
          console.log(`Get response from the server Not OK: `, response);
        }
      } catch (ex) {
        console.log(`Could not remove product: `, ex);
      }
    })
  });

  $('.js-cat-del').click(async (e) => {
    e.preventDefault();

    const target = e.target;
    const url = target.attributes.onclick.value;
    const row = target.closest('tr');
    const name = row.querySelector('[name="category_name"]').value;

    try {
      const response = await fetch(url, {
        method: 'DELETE'
      });

      if (response.ok) {

        $(row).fadeOut(500, () => {
          $(row).remove();

          Lobibox.notify('warning', {
            msg: `Категория ${name} была успешно удалена`,
            closable: true,
            delay: 5000,
            sound: 'sound6',
            position: "bottom right"
          });

        });

      } else {
        console.log(`Ошибка с сервера: ${response.statusText}`);
      }
    } catch (err) {
      console.log('Could not delete category: ', err)
    };
  });

  $('.js-remove-user').click(async (e) => {
    e.preventDefault();

    const target = e.currentTarget;
    const url = target.attributes.onclick.value;
    const row = $(target.form.parentElement);
    const name = row.find('[name="login"]').val();

    try {
      const response = await fetch(url, {
        method: 'DELETE'
      });

      if (response.ok) {
        row.fadeOut(500, () => {
          row.remove();

          Lobibox.notify('warning', {
            msg: `Пользователь ${name} был удален`,
            closable: true,
            delay: 5000,
            sound: 'sound6',
            position: "bottom right"
          });

        });
      } else {
        console.log(`Received response with status ${response.status}: `, response);
      }
    } catch (ex) {
      console.log(`Could not remove user: `, ex);
    }
  });

  $('.js-send-notification').click(async (e) => {
    e.preventDefault();

    const form = e.target.closest('form');
    const formData = new FormData(form);
    const url = form.getAttribute('action');
    const confirmation = form.querySelector('.form__checkbox');

    if (confirmation && !confirmation.checked) {
      form.querySelector('.feedback__rules').classList.add('error');
    } else {
      try {
        const response = await fetch(url, {
          body: formData,
          method: 'POST'
        });

        const data = await response.json();

        if (response.ok) {
          form.reset();
          closeFeedbackForm();

          Lobibox.notify('success', {
            msg: data.report,
            closable: true,
            delay: 5000,
            sound: 'sound6',
            position: "bottom right"
          })
        } else {
          Object.keys(data).forEach(key => {
            const input = form.querySelector(`[name=${key}]`);

            input.classList.add('error');
            input.value = '';
            input.placeholder = data[key];
          });

          console.log(`При отправке запроса на сервер произошла ошибка: `, data);
        }
      } catch (err) {
        console.log(`Error occured during fetching server request: `, err)
      };
    }

  });
});


const clearModal = (modalID) => {

  // очистить поля модалки после закрытия окна
  let formElements = document.querySelector(`#${modalID}`).elements;

  for (i = 0; i < formElements.length; i++) {
    field_type = formElements[i].type.toLowerCase();
    switch (field_type) {
      case "text":
      case "password":
      case "hidden":
        formElements[i].value = "";
        break;
      case "number":
        formElements[i].value = 0;
        break;
      case "textarea":
        let isEditor = false;
        $.each(formElements[i].attributes, (key, val) => {
          if (val.value == 'text-editor') {
            isEditor = true;
            return false;
          }
        });
        isEditor ? $(formElements[i]).summernote('code', '') : $(formElements[i]).text('');
        break;
      case "radio":
      case "checkbox":
        if (formElements[i].checked) {
          formElements[i].checked = false;
        }
        break;
      case "select-one":
      case "select-multi":
        formElements[i].selectedIndex = -1;
        break;
      default:
        break;
    }
  }

}

const productDataEdit = async () => {
  const form = document.querySelector('#prod-mngment-form');
  const id = form.querySelector('[name="id"]').value;


  try {
    const response = await fetch(`/products/edit/${id}`, {
      body: new FormData(form),
      method: 'POST'
    })
    if (response.ok) {
      console.log(`Продукт изменен`);
    }
  } catch (err) {
    console.log(`Client recieved error: ${err}`)
  }
}

const lookForServerMessage = () => {
  const serverMsg = document.querySelectorAll('input.js-server-msg');

  serverMsg.forEach(msg => {
    let type = '';

    switch (msg.attributes.name.value) {
      case 'success-message':
        type = 'success'
        break;
      case 'error-message':
        type = 'warning'
        break;
      default:
        type = 'info'
        break;
    }

    Lobibox.notify(type, {
      msg: msg.value,
      closable: true,
      delay: 5000,
      sound: 'sound6',
      position: "bottom right",
    });

    msg.remove();
  })
}

const openFeedbackForm = (dur = 700) => {
  const body = document.querySelector('body');
  body.classList.add('feedback-open');
  body.insertAdjacentHTML('afterbegin', '<div class="fog-layout"></div>');

  $('.feedback').animate({
    right: "0",
    opacity: 1
  }, dur);

  document.querySelector('.fog-layout')
    .addEventListener('click', e => closeFeedbackForm());
}

const closeFeedbackForm = (dur = 700) => {
  const fog = document.getElementsByClassName('fog-layout');

  if (fog.length > 0) {
    fog[0].removeEventListener('click', closeFeedbackForm);
    fog[0].remove();
  }
  document.querySelector('body').classList.remove('feedback-open');

  $('.feedback').animate({
    right: "-100%",
    opacity: 0
  }, dur);
}