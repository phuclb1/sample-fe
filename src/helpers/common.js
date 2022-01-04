import $ from 'jquery';

export function setThemeByMode(mode = 'ne-light') {
    const antdStyleUrl = mode === 'ne-dark' ? '/vendor/antd/antd.dark.css' : '/vendor/antd/antd.css';
    $('#antdStyleSheet').attr('href', antdStyleUrl);
    $('body').removeClass('ne-light');
    $('body').removeClass('ne-dark');
    $('body').addClass(mode);
    localStorage.setItem('NEXT_FACE_THEME', mode);
}