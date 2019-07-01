<template>
  <!-- Wrapper -->
  <div id="wrapper">
    <!-- Banner -->
    <section id="banner" class="major">
      <div class="inner">
        <header class="major">
          <h1>BlockNote.xyz</h1>
        </header>
        <div class="content">
          <p>
            Most productive way to write your notes.
            <br />
            <a target="_blank" href="https://blockstack.org/about/">What is Blockstack?</a>
          </p>
          <ul class="actions">
            <li>
              <a href="https://blocknote.xyz/login" class="button">Login With Blockstack</a>
            </li>
          </ul>
        </div>
      </div>
    </section>

    <!-- Main -->
    <div id="main">
      <!-- One -->
      <section id="one" class="tiles">
        <article>
          <span class="image">
            <img src="~@/assets/landing/pic01.jpg" alt />
          </span>
          <header class="major">
            <h3>
              <i class="fas fa-shield-alt"></i> Secure
            </h3>
            <p>
              Your data is encrypted with keys that only you hold via
              <a
                href="https://blockstack.org"
                target="_blank"
              >Blockstack.</a>
            </p>
          </header>
        </article>
        <article>
          <span class="image">
            <img src="~@/assets/landing/pic02.jpg" alt />
          </span>
          <header class="major">
            <h3>
              <i class="fas fa-fighter-jet"></i>
              <i class="fas fa-running"></i> Quick and Simple
            </h3>
            <p>Find, edit and copy your notes in seconds using advanced search and tags.</p>
          </header>
        </article>
        <article>
          <span class="image">
            <img src="@/assets/landing/pic03.jpg" alt />
          </span>
          <header class="major">
            <h3>
              <i class="fas fa-mobile-alt"></i>
              <i class="fas fa-desktop"></i> Access anywhere
            </h3>
            <p>Access your notes on mobile and desktop devices.</p>
          </header>
        </article>
        <article>
          <span class="image">
            <img src="@/assets/landing/pic04.jpg" alt />
          </span>
          <header class="major">
            <h3>
              <i class="fas fa-keyboard"></i> Keyboard Focused
            </h3>
            <p>Keyboard shortcuts for everything</p>
          </header>
        </article>
      </section>

      <!-- Two -->
      <section id="two">
        <div class="inner">
          <ul class="actions">
            <li>
              <a href="https://blocknote.xyz/login" class="button">Get Started</a>
            </li>
          </ul>
        </div>
      </section>
    </div>

    <!-- Footer -->
    <footer id="footer">
      <div class="inner">
        <p>
          contact:
          <a href="mailto:alarivan@pm.me">alarivan@pm.me</a>
        </p>
        <ul class="copyright">
          <li>
            Design:
            <a href="https://html5up.net">HTML5 UP</a>
          </li>
        </ul>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: "landing",
  data() {
    return {
      items: [
        {
          title: "Encrypted",
          description:
            "Your data is encrypted with keys that only you hold via <a class='underline hover:text-green-600' href='https://blockstack.org' target='_blank'>Blockstack.</a>"
        },
        {
          title: "Quick and Simple",
          description:
            "Find, edit and copy your notes in seconds using advanced search and tags."
        },
        {
          title: "Decentralised",
          description: "You are in control of where your data is stored."
        },
        {
          title: "Access anywhere",
          description:
            "You have acces to your notes on mobile and desktop devices."
        }
      ]
    };
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import "../styles/landing/main.scss";
</style>