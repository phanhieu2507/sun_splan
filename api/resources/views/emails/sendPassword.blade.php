@component('mail::message')
<p>
    アカウントの登録に成功しました。<br>
    今後、{{ $email }} のアカウントで <br>
    SPLANにログインできます。<br>
    パスワード: {{ $password }}<br>
    ログイン後、パスワードを変更してください。<br>
    SPLANのホームページ： <a href="https://splan-admin.sun-asterisk.com">https://splan-admin.sun-asterisk.com</a>
</p>
@endcomponent