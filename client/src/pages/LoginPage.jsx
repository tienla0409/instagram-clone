import { useEffect, useState } from "react";
import { AiFillFacebook } from "react-icons/ai";
import { Form, Spinner } from "../components";
import { useHistory } from "react-router-dom";
import * as ROUTES from "../constants/routes";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../actions/userAction";

const LoginPage = () => {
  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo, isLoading, err } = userLogin;

  const history = useHistory();

  const [imgNumber, setImgNumber] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // check valid fields email, password
  const isInvalid =
    email.trim() === "" ||
    password.trim() === "" ||
    password.trim().length < 6 ||
    !/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
      email.toLowerCase(),
    );

  useEffect(() => {
    const timerImg = setInterval(() => {
      if (imgNumber === 4) {
        setImgNumber(1);
      } else {
        setImgNumber(imgNumber + 1);
      }
    }, 3000);

    return () => {
      clearInterval(timerImg);
    };
  }, [imgNumber]);

  useEffect(() => {
    if (userInfo) {
      history.push(ROUTES.HOME);
    }
    if (err) {
      setError(err);
    }
  }, [userInfo, history, err]);

  // handle login
  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(login(email, password));
  };

  return (
    <Form>
      <Form.Wrap>
        <Form.ImgWrap>
          <Form.ImgList>
            <Form.ImgItem src={`/images/phone${imgNumber}.jpg`} />
          </Form.ImgList>
        </Form.ImgWrap>
        <Form.BaseWrap>
          <Form.Base onSubmit={handleSubmit} autocomplete="off">
            <Form.Title>Instagram</Form.Title>
            <Form.Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="text"
              placeholder="Email"
            />
            <Form.Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Password"
            />
            {err && err}
            <Form.Button type="submit" disabled={isInvalid}>
              {isLoading ? (
                <Spinner size="sm" color="white"></Spinner>
              ) : (
                "Sign in"
              )}
            </Form.Button>

            <Form.Separate></Form.Separate>

            <Form.SocialWrap to="/">
              <Form.SocialIcon>
                <AiFillFacebook />
              </Form.SocialIcon>
              <Form.SocialName>Log in with Facebook</Form.SocialName>
            </Form.SocialWrap>
            {error && <Form.Error login>{error}</Form.Error>}
            <Form.ForgotPassword to="/">Forgot password?</Form.ForgotPassword>
          </Form.Base>
          <Form.Option>
            <Form.OptionText>
              Don't have an account?&nbsp;
              <Form.OptionLink to={ROUTES.SIGN_UP}>Sign up</Form.OptionLink>
            </Form.OptionText>
          </Form.Option>
          <Form.DownloadWrap>
            <Form.DownloadText>Get the app</Form.DownloadText>
            <Form.DownloadOS>
              <Form.DownloadLink>
                <Form.DownloadImg src="/images/apple.png" />
              </Form.DownloadLink>
              <Form.DownloadLink>
                <Form.DownloadImg src="/images/google-play.png" />
              </Form.DownloadLink>
            </Form.DownloadOS>
          </Form.DownloadWrap>
        </Form.BaseWrap>
      </Form.Wrap>
    </Form>
  );
};

export default LoginPage;