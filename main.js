$(document).ready(function () {
  let users = [];
  let gender;
  let genderValue = $("#gender");
  let avatar;

  genderValue.on('change', function () {
    gender = $(this).val();
  })

  // GENARATORS

  function generate(user) {
    $('#myTable').show()
    let row = $('<tr>');

    if (user.picture) {
      row.append($('<td>').html('<img src="' + user.picture.thumbnail + '">'));
    }
    else if (user.avatar) {
      row.append($('<td>').html('<img src="' + user.avatar + '">'));
    }
    else {
      row.append($('<td>').html('-'));
    }

    if (typeof user.name == "object") {
      row.append($('<td>').text(user.name.first + ' ' + user.name.last));
    } else {
      row.append($('<td>').text(user.name));
    }

    row.append($('<td>').text(user.email));
    row.append($('<td>').text(user.phone));
    if (user.address) {
      row.append($('<td>').text(user.address));
    } else if (!user.address || user.address == '') {
      row.append($('<td>').text("-"));
    }

    if (user.gender) {
      row.append($('<td>').text(user.gender));
    }

    if (!user.independently_created) {
      let button = $('<button class="info btn-primary">').text('Детальніше');
      let cell = $('<td>');
      cell.append(button);
      button.on('click', function () {
        let modalBody = $('#userModal .modal-body');
        modalBody.empty();
        modalBody.append('<p><strong>Ім\'я:</strong> ' + user.name.first + ' ' + user.name.last + '</p>');
        modalBody.append('<p><strong>Адреса:</strong> ' + user.location.street.name + ' ' + user.location.street.number + ', ' + user.location.city + ', ' + user.location.state + ', ' + user.location.country + '</p>');
        modalBody.append('<p><strong>Email:</strong> ' + user.email + '</p>');
        modalBody.append('<p><strong>Телефон:</strong> ' + user.phone + '</p>');
        $('#userModal').modal('show');
      });
      row.append(cell);
    }
    $('tbody').prepend(row);
    $(".title-status").hide()
  }

  // LOCAL STORAGE CHECK
  if (localStorage.getItem("Users")) {
    users = JSON.parse(localStorage.getItem('Users'));
    users.forEach(e => {
      generate(e)
    })
  }

  function getUser(gender) {
    $('.loader').show();
    $.ajax({
      url: `https://randomuser.me/api/?results=1&gender=${gender}`,
      dataType: 'json',
      success: function (data) {
        console.log(this.url)
        $.each(data.results, function (index, user) {
          generate(user);
          users.push(user);
          localStorage.setItem('Users', JSON.stringify(users));
        });
      }, complete: function () {
        status.css("background", "green");
        status.css("color", "#fff");
        status.css("top", "20px");
        status.text("Користувача додано")
        setTimeout(() => {
          status.css("top", "-120%");
        }, 2000)
        $('.loader').hide();
      }, error: function (jqXHR, textStatus, errorThrown) {
        status.css("background", "red");
        status.css("color", "#000");
        status.css("top", "20px");
        status.text("Упс(( Виникла помилка");
        setTimeout(() => {
          status.css("top", "-120%");
        }, 2000)
      }
    });
  }

  $("#getUserBtn").click(function () {
    getUser(gender)
  })

  // STATUS
  let status = $(".status")
  $('#signup-form').submit(function (event) {
    event.preventDefault();
    let form = $(this);
    if (form[0].checkValidity() === false) {
      event.stopPropagation();
    }
    form.addClass('was-validated');
  });

  // STATUS END

  // LOADER HIDE
  $('.loader').hide();



  if ($('#myTable').has('td').length == 0) {
    $(".title-status").show()
  } else {
    $(".title-status").hide()
  }

  // MASK PHONE

  $('#phone').mask('+99(999) 999-99-99');

  // FORM

  $('#form').on('submit', function (e) {
    e.preventDefault()
    let email = $('#email').val();
    let phone = $('#phone').val();
    let name = $("#name").val();
    let address = $("#address").val();
    let gender = $("#form-gender").val();
    $(".title-status").hide()
    $('#myTable').show()

    let emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;

    if (!emailRegex.test(email)) {
      $('#email').addClass('is-invalid');
      $('#email + .invalid-feedback').text('Будь ласка, введіть коректну електронну адресу.');
    } else {
      $('#email').removeClass('is-invalid');
      $('#email + .invalid-feedback').text('');
    }

    if (phone.replace(/-/g, '').length < 10) {
      $('#phone').addClass('is-invalid');
      $('#phone + .invalid-feedback').text('Будь ласка, введіть коректний номер телефону.');
    } else {
      $('#phone').removeClass('is-invalid');
      $('#phone + .invalid-feedback').text('');
    }

    let row = $('<tr>');
    if (avatar) {
      row.append($('<td>').html('<img src="' + avatar + '">'));
    } else {
      row.append($('<td>').html('-'));
    }

    row.append($('<td>').text(name));
    row.append($('<td>').text(email));
    row.append($('<td>').text(phone));
    if (address) {
      row.append($('<td>').text(address));
    } else {
      console.log(address)
      row.append($('<td>').text("-"));
    }
    row.append($('<td>').text(gender));
    $('tbody').prepend(row);
    let user = {
      email, phone, name, address, avatar, gender, independently_created: true,
    }
    users.push(user);
    localStorage.setItem('Users', JSON.stringify(users));
    $('#modalCreate').modal('hide');
    console.log(email)
    $(this).trigger('reset')
  });



  // AVATAR RENDER

  $('#avatar').on('change', function (event) {
    var file = event.target.files[0];
    var reader = new FileReader();
    reader.onload = function (event) {
      avatar = event.target.result
    };
    reader.readAsDataURL(file);
  });

});

