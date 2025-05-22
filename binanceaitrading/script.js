
import { supabase } from './supabaseClient.js';

const loginBtn = document.getElementById('submit-login');
const loginSection = document.getElementById('login-section');
const dashboard = document.getElementById('dashboard');
const balanceDiv = document.getElementById('balance');

loginBtn.addEventListener('click', async () => {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    alert('Error al iniciar sesión');
    return;
  }

  loginSection.classList.add('hidden');
  dashboard.classList.remove('hidden');
  fetchBalance(data.user.id);
});

async function fetchBalance(userId) {
  const { data } = await supabase.from('usuarios').select('balance').eq('id', userId).single();
  balanceDiv.textContent = `Balance: $${data?.balance || 0}`;
}
