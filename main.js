import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// إعداد Supabase
const supabaseUrl = 'https://narakieunwgzeozzxkxu.supabase.co';
const supabaseKey = 'sb_publishable_0iF0iT70IA9OGIUPfuaXdw_dnQYBXaF';
const supabase = createClient(supabaseUrl, supabaseKey);

// زر إنشاء الحساب
const signupBtn = document.getElementById('signupBtn');

// دالة إنشاء حساب
async function signup() {
  signupBtn.disabled = true;

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  const { data, error } = await supabase.auth.signUp(
    { email, password },
    { emailRedirectTo: 'https://fopontop73-cloud.github.io/fopontop73-cloud-lessons-or-videos/' }
  );

  if (error) {
    alert(error.message);
    signupBtn.disabled = false;
    return;
  }

  alert('تم إنشاء الحساب! ✅\nتحقق من بريدك لتأكيد الحساب.');
  signupBtn.disabled = false;
}

// دالة تسجيل الدخول
async function login() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    alert(error.message);
    return;
  }

  alert('تم تسجيل الدخول!');
  document.getElementById('authSection').style.display = 'none';
  document.getElementById('lessonsList').style.display = 'block';
  loadLessons();
}

// تحميل الدروس
async function loadLessons() {
  const { data, error } = await supabase.from('lessons').select('*');
  if (error) { console.log(error); return; }

  let html = '';
  data.forEach(lesson => {
    html += `<div>
      <h4>${lesson.title}</h4>
      <p>${lesson.description}</p>
      <button onclick="viewLesson('${lesson.video_path}')">شاهد الدرس</button>
    </div>`;
  });
  document.getElementById('lessonsList').innerHTML = html;
}

// عرض الدرس بالفيديو
async function viewLesson(videoPath) {
  const { data, error } = await supabase
    .storage
    .from('lessons-videos')
    .createSignedUrl(videoPath, 3600);

  if (error) { alert('خطأ في الوصول للفيديو'); return; }
  window.open(data.signedUrl, '_blank');
}

// ربط الدوال بالواجهة
window.signup = signup;
window.login = login;
window.viewLesson = viewLesson;