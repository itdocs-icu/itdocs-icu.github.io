// function collapse(name, body, i) {
//     if (name.classList.contains('accordion')) {
//         var acco_body = name.querySelector('.accordion-body');
//         acco_body.appendChild(body);
//         return name;
//     }
//
//     var accordion = document.createElement('div');
//     accordion.setAttribute("class", "accordion");
//
//     var acco_body = document.createElement('div');
//     acco_body.setAttribute("class", "accordion-body");
//     acco_body.appendChild(body);
//
//     var checkbox = document.createElement('input');
//     checkbox.setAttribute("type", "checkbox");
//     checkbox.setAttribute("id", "accordion-" + i);
//     checkbox.setAttribute("hidden", "");
//
//     var label = document.createElement('label');
//     label.textContent = name.textContent
//     label.setAttribute("class", "accordion-header c-hand");
//     label.setAttribute("for", "accordion-" + i);
//
//     var icon = document.createElement('i');
//     icon.setAttribute("class", "icon icon-arrow-down");
//     label.appendChild(icon);
//
//     accordion.appendChild(checkbox);
//     accordion.appendChild(label);
//     accordion.appendChild(acco_body);
//
//     name.parentNode.replaceChild(accordion, name);
// }

// clear invalid syntax
// function clear_invalid_syntax() {
//     document.querySelectorAll('.book-menu > :not(ul):not(h1):not(h2):not(h3):not(h4):not(h5):not(h6)').forEach((e) => {
//         e.parentNode.removeChild(e);
//     })
// }

// // pack accordion
// function pack_menu_accordion() {
//     document.querySelectorAll('.book-menu > ul').forEach((e, idx) => {
//         var sibling = e.previousElementSibling;
//         while (sibling != null) {
//             if (sibling.tagName == "H1" || sibling.tagName == "H2" ||
//                 sibling.tagName == "H3" || sibling.tagName == "H4" ||
//                 sibling.tagName == "H5" || sibling.tagName == "H6") {
//                 break;
//             }
//             sibling = sibling.previousElementSibling;
//         }
//         if (!sibling || sibling.tagName == "H1") {
//             e.classList.add('uncollapsible');
//         }
//         else {
//             collapse(sibling, e, idx);
//         }
//     })
// }
//
// // highlight current tab
// function highlight_current_tab() {
//     document.querySelectorAll('.book-menu a').forEach((item) => {
//         if (!item.getAttribute('href')) return // if href has no value
//         // normalized url
//         let sharp = window.location.href.search('#');
//         let url = window.location.href
//         if (sharp != -1) {
//             url = url.slice(0, sharp);
//         }
//         if (url.slice(-1) == '/') {
//             url = url.slice(0, -1);
//         }
//         if (item.href === url) {
//             item.classList.add('current-tab')
//             var parent = item.parentNode;
//             while (!parent.classList.contains("book-menu")) {
//                 if (parent.classList.contains("accordion")) {
//                     break;
//                 }
//                 parent = parent.parentNode;
//             }
//             if (parent.classList.contains("accordion")) {
//                 parent.querySelector('input').setAttribute("checked", "");
//             }
//         }
//     })
// }
//
// function show_sidebar() {
//     var menu = document.getElementById('menu');
//     menu.classList.remove('hide');
// }
//
// /* ----- onload ----- */
//
// clear_invalid_syntax()
// pack_menu_accordion()
// highlight_current_tab()
// show_sidebar()

// restore sidebar position after reloading page
// window.addEventListener('beforeunload', () => {
//     let sidebarPos = document.querySelector('.book-menu').scrollTop
//     window.localStorage.setItem('sidebarPos', sidebarPos)
// })
//
// if (window.localStorage.sidebarPos) {
//     let sidebarPos = window.localStorage.sidebarPos
//     document.querySelector('.book-menu').scrollTop = sidebarPos
// }
$(document).ready(function() {
    clickTreeDirectory();
    serachTree();
});


// 搜索框输入事件
function serachTree() {
    // 解决搜索大小写问题
    jQuery.expr[':'].contains = function(a, i, m) {
        return jQuery(a).text().toUpperCase().indexOf(m[3].toUpperCase()) >= 0;
    };

    $("#search-input").on("input", function(e) {
        e.preventDefault();

        // 获取 inpiut 输入框的内容
        var inputContent = e.currentTarget.value;

        // 没值就收起父目录，但是得把 active 的父目录都展开
        if (inputContent.length === 0) {
            $(".fa-minus-square-o").removeClass("fa-minus-square-o").addClass("fa-plus-square-o");
            $("#tree ul").css("display", "none");
            if ($("#tree .active").length) {
                showActiveTree($("#tree .active"), true);
            } else {
                $("#tree").children().css("display", "block");
            }
        }
        // 有值就搜索，并且展开父目录
        else {
            $(".fa-plus-square-o").removeClass("fa-plus-square-o").addClass("fa-minus-square-o");
            $("#tree ul").css("display", "none");
            var searchResult = $("#tree li").find("a:contains('" + inputContent + "')");
            if (searchResult.length) {
                showActiveTree(searchResult.parent(), false)
            }
        }
    });

    $("#search-input").on("keyup", function(e) {
        e.preventDefault();
        if (event.keyCode == 13) {
            var inputContent = e.currentTarget.value;

            if (inputContent.length === 0) {} else {
                window.open(searchEngine + inputContent + "%20site:" + homeHost, "_blank");
            }
        }
    });
}


// 点击目录事件
function clickTreeDirectory() {
    var treeActive = $("#tree .active");
    if (treeActive.length) {
        showActiveTree(treeActive, true);
        $('.active').parent('ul').siblings('.directory').addClass('active');
        $('.active').parent('ul').parent('li').parent('ul').siblings('.directory').addClass('active');
    }
    $(document).on("click", "#tree a[class='directory']", function(e) {
        $(this).toggleClass('active');
        $(this).siblings('ul').toggle();
    });
    $(document).on("click", ".active", function(e) {
        $(this).toggleClass('active');
        $(this).siblings('ul').hide();
    });
}

function showActiveTree(jqNode, isSiblings) {
    if (jqNode.attr("id") === "tree") {
        return;
    }
    if (jqNode.is("ul")) {
        jqNode.show();
        if (isSiblings) {
            jqNode.siblings().show();
            jqNode.siblings("a").css("display", "inline");
        }
    }
    jqNode.each(function() {
        showActiveTree($(this).parent(), isSiblings);
    });
}

$(function() {
    if ($("ul").css('display') == "block") {
        $(this).siblings('a').addClass('active');
    }
    if ($("#content").hasClass('content-on')) {} else {
        $(this).addClass('mw80');
    }
})


/*页面载入完成后，创建复制按钮*/
// 更改为直接用线上的 prism
// $(document).ready(function() {
//     $('input').parent('li').css('list-style','none');
//     $('table').wrap('<div class="overflow-scroll" />');
//     var initCopyCode = function() {
//         var copyHtml = '';
//         copyHtml += '<button class="btn-copy btn-copy-toast">';
//         copyHtml += '<span class="material-icons">content_copy</span>';
//         copyHtml += '</button>';
//         $(".highlight div").before(copyHtml);
//         new ClipboardJS('.btn-copy', {
//             target: function(trigger) {
//                 return trigger.nextElementSibling;
//             }
//         });
//     }
//     initCopyCode();
//     var t = $('input').attr("type");
//     if( t == 'checkbox'){
//         $(t).siblings('p').addClass('disinline');
//     }
//     var toct = $('.toc-title')
//     if($(toct).siblings().length){
//     }else{
//
//         $(toct).parent('.widget-wrapper').hide();
//     }
// });
