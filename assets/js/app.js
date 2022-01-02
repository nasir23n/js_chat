var site_setting = {
    "chat_list": [
        {
            sender: "User One",
            reciver: "User Two",
            folder: 'index',
            sender_profile: 'profile/user1.jpg',
            reciver_profile: 'profile/user2.jpg',
            total: 227125,
        }
    ]
}


$('.setting_oc').click(function () {
    $(this).toggleClass('active');
    $('.right_aside').toggleClass('active');
});
$('.search_oc').click(function () {
    $('.left_aside').addClass('active');
});

$('#search_fld').on('focus', function () {
    $(this).addClass('active');
    $('.src_w').addClass('active');
    $('.result_box').addClass('active');
});
$('.c_src').click(function () {
    $('#search_fld').removeClass('active');
    $('.result_box').removeClass('active');
    $('.src_w').removeClass('active');
});
$('.c_aside').click(function () {
    $('.left_aside').removeClass('active');
});


$('#rb_profile').find('.img').html(`<img src="${config.reciver_profile}" alt=""><img src="${config.sender_profile}" alt="">`);
$('#rb_profile').find('.name').html(`<strong>${config.sender}</strong><span>with</span><strong>${config.reciver}</strong>`);
var as_lnk = '';
site_setting.chat_list.forEach(element => {
    as_lnk += `<li>
                <a href="${element.folder}.html">
                    <div class="id_profile">
                        <img src="${element.reciver_profile}" alt="">
                        <img src="${element.sender_profile}" alt="">
                    </div>
                    <div class="in_inf">
                        <div class="id_name">
                            ${element.sender}
                            <br>
                            ${element.reciver}
                        </div>
                        <div class="inf">
                            Total: ${element.total} Messages
                        </div>
                    </div>
                </a>
            </li>`;
});
$('#chat_list').html(as_lnk);
let chat_list = $('#chat_list').find('li a');
var w_ur = location.pathname.split("/").reverse()[0];
chat_list.each(function () {
    var this_ur = $(this).attr('href');
    if (w_ur == this_ur) {
        $(this).addClass('active');
    } else {
        $(this).removeClass('active');
    }
});

// infinite scroll 
let msg_scrollable = document.getElementById('msg');
let scrollY, msg_height, scrollHeight;
msg_scrollable.addEventListener('scroll',(e) => {
    scrollY = msg_scrollable.scrollTop;
    msg_height = msg_scrollable.clientHeight;
    scrollHeight = msg_scrollable.scrollHeight;
    if(scrollY + msg_height >= scrollHeight) {
        load_more();
    }
});