import './app.css';
import { Logo } from './logo.component';

function App() {
  return (
    <section>
      <header>
        <Logo />
      </header>
      <footer>
        <ul>
          <li>
            <a
              href="https://github.com/rainx"
              title="GitHub"
              className="github"
            >
              <i className="fa-brands fa-github" />
            </a>
          </li>
          <li>
            <a
              href="https://weibo.com/102068233"
              title="Weibo"
              className="weibo"
            >
              <i className="fa-brands fa-weibo" />
            </a>
          </li>
          <li>
            <a
              href="https://twitter.com/rainx"
              title="𝕏 - Twitter"
              className="twitter"
            >
              <i className="fa-brands fa-x-twitter" />
            </a>
          </li>
          <li>
            <a
              href="https://www.linkedin.com/in/jing-xu-rainx"
              title="Linked In"
              className="linked-in"
            >
              <i className="fa-brands fa-linkedin-in" />
            </a>
          </li>
          <li>
            <a
              href="https://www.instagram.com/rainx1982/"
              title="Instagram"
              className="instagram"
            >
              <i className="fa-brands fa-instagram" />
            </a>
          </li>
          <li>
            <a
              href="https://unsplash.com/@rainx1982"
              title="Unsplash"
              className="unsplash"
            >
              <i className="fa-brands fa-unsplash" />
            </a>
          </li>
        </ul>
      </footer>
    </section>
  );
}

export default App;
