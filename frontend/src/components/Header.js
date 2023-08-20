import logo from '../images/logo.svg';
import { useNavigate, useMatch, Link } from 'react-router-dom';

function Header({ userData, setIsLoggedIn }) {

    const address = useMatch({ path: `${window.location.pathname}`, end: false });
    const isRootPage = address.pathname.endsWith('/');
    const isLoginPage = address.pathname.endsWith('/sign-in');

    const navigate = useNavigate();

    function signOutUser() {
        localStorage.removeItem('jwt');
        navigate('/sign-in', { replace: true });
        setIsLoggedIn(false);
    };

    function renderHeader() {
        return (
            <nav className="navbar">
            {isRootPage ?
                <>
                    <p className="navbar__email">{userData.email}</p>
                    <button className="navbar__action"
                            type='button'
                            aria-label='Выйти'
                            onClick={signOutUser}
                    >Выйти</button>
                </>
                :
                <Link className="navbar__action navbar__action_is-active"
                        to={isLoginPage ? "../sign-up" : "../sign-in"}>
                    {isLoginPage ? "Регистрация" : "Войти"}
                </Link>
                
            }
            </nav>
        );
    }

    return (
        <header className="header">
            <img className="header__logo" alt="Лого" src={logo}/>
            {renderHeader()}
        </header>
    );
}

export default Header;