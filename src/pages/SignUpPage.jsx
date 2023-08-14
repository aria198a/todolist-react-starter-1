import {
  AuthContainer,
  AuthInputContainer,
  AuthButton,
  AuthLinkText,
} from 'components/common/auth.styled';
import { ACLogoIcon } from 'assets/images';
import { AuthInput } from 'components';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useAuth } from 'contexts/AuthContext';

const SignUpPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const { register, isAuthenticated } = useAuth();

  const handleClick = async () => {
    const success= await register({
      username,
      email,
      password
    })
    if (success) {
      Swal.fire({
        title: '註冊成功!',
        timer: 1000,
        icon: 'success',
        position: 'top',
        showConfirmButton: false,
      });
      navigate('/todo')
      return
    }
    Swal.fire({
      position: 'top',
      title: '註冊失敗！',
      timer: 1000,
      icon: 'error',
      showConfirmButton: false,
    });
  }

  useEffect(() => {
    if(isAuthenticated) {
      navigate('/todo')
    }
  }, [navigate, isAuthenticated]);

  return (
    <AuthContainer>
      <div>
        <ACLogoIcon />
      </div>
      <h1>建立您的帳號</h1>

      <AuthInputContainer>
        <AuthInput 
          label="帳號"
          placeholder="請輸入帳號"
          value={username}
          onChange={(nameInputValue) => setUsername
          (nameInputValue)}
        />
      </AuthInputContainer>

      <AuthInputContainer>
        <AuthInput 
          label="Email"
          placeholder="請輸入 email"
          value={email}
          onChange={(emailInputValue) => setEmail
          (emailInputValue)}
        />
      </AuthInputContainer>

      <AuthInputContainer>
        <AuthInput 
          label="密碼"
          placeholder="請輸入密碼"
          value={password}
          onChange={(passwordInputValue) => setPassword
          (passwordInputValue)}
        />
      </AuthInputContainer>
      <AuthButton onClick={handleClick}>註冊</AuthButton>

      <Link to="/login"> 
        <AuthLinkText>取消</AuthLinkText>
      </Link>
    </AuthContainer>
  );
};

export default SignUpPage;
