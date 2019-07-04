<template>
  <div id="wrapper">
    <section id="banner" class="major">
      <div class="inner">
        <header class="major">
          <h1>BlockNote.xyz</h1>
        </header>
        <div class="content">
          <p>
            Most productive way to write your notes.
            <br />
            <a class="link" target="_blank" href="https://blockstack.org/about/">What is Blockstack?</a>
          </p>
          <button class="button" @click="signIn">Login With Blockstack</button>
        </div>
      </div>
    </section>

    <div id="main">
      <section id="one" class="tiles">
        <article id="tile1">
          <header class="major">
            <h3>
              <svg class="icon">
                <use xlink:href="#icon-shield" />
              </svg>
              <span>Secure</span>
            </h3>
            <p>
              Your data is encrypted with keys that only you hold via
              <a
                class="link"
                href="https://blockstack.org"
                target="_blank"
              >Blockstack</a>
            </p>
          </header>
        </article>
        <article id="tile2">
          <header class="major">
            <h3>
              <svg class="icon icon-rocket">
                <use xlink:href="#icon-rocket" />
              </svg>
              <span>Quick and Simple</span>
            </h3>
            <p>Find, edit and copy your notes in seconds using advanced search and tags.</p>
          </header>
        </article>
        <article id="tile3">
          <header class="major">
            <h3>
              <svg class="icon">
                <use xlink:href="#icon-display" />
              </svg>
              <svg class="icon">
                <use xlink:href="#icon-mobile" />
              </svg>
              <span>Access anywhere</span>
            </h3>
            <p>Access your notes on mobile and desktop devices.</p>
          </header>
        </article>
        <article id="tile4">
          <header class="major">
            <h3>
              <svg class="icon icon-keyboard">
                <use xlink:href="#icon-keyboard" />
              </svg>
              <span>Keyboard Focused</span>
            </h3>
            <p>Keyboard shortcuts for everything</p>
          </header>
        </article>
      </section>
      <section id="two">
        <div class="inner">
          <button class="button" @click="signIn">Get Started</button>
        </div>
      </section>
    </div>

    <footer id="footer">
      <div class="inner">
        <div>
          contact:
          <a class="link" href="mailto:alarivan@pm.me">alarivan@pm.me</a>
        </div>
        <div class="copyright">
          <div>
            Design:
            <a class="link" target="_blank" href="https://html5up.net">HTML5 UP</a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import { userSession } from "../helper/userSession";
export default {
  name: "landing",
  methods: {
    signIn() {
      if (this.user) {
        this.$router.push("/");
      } else {
        userSession.redirectToSignIn();
      }
    }
  },
  computed: {
    user() {
      return this.$store.state.user;
    }
  }
};
</script>

<style scoped lang="scss">
@import url("https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,300italic,600,600italic");
#wrapper {
  font-family: "Source Sans Pro", Helvetica, sans-serif;

  @apply text-white mx-auto;
  max-width: 1440px;

  header {
    @apply mb-8;

    h1,
    h3 {
      @apply border-b-2 border-white font-bold leading-loose;
    }
    h1 {
      @apply text-3xl;

      @screen sm {
        @apply text-5xl;
      }
    }
    h3 {
      @apply text-3xl;
    }
  }

  .content {
    @screen sm {
      @apply flex items-center;
    }
  }

  p {
    @apply text-xs font-semibold uppercase mb-6;
    letter-spacing: 0.18rem;

    @screen sm {
      @apply mb-0 mr-3;
    }
  }

  a.link {
    transition: color 0.2s ease-in-out, border-bottom-color 0.2s ease-in-out;
    @apply border-b border-dotted no-underline;

    &:hover {
      border-bottom-color: transparent;
      color: #9bf1ff;
    }
  }

  .button {
    transition: background-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out,
      color 0.2s ease-in-out;
    box-shadow: inset 0 0 0 2px #ffffff;
    letter-spacing: 0.18rem;
    @apply text-white inline-block text-xs font-semibold text-center uppercase px-3 py-3 no-underline;

    @screen sm {
      @apply px-5;
    }

    &:hover,
    &:active {
      box-shadow: inset 0 0 0 2px #9bf1ff;
      color: #9bf1ff;
    }
  }

  #banner {
    @apply flex items-center pt-24 pb-16 relative;

    background-image: url("~@/assets/landing/banner1.jpg");
    background-attachment: fixed;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    background-attachment: scroll;
    height: 75vh;
    min-height: 30em;
    max-height: 50em;

    @screen sm {
      @apply flex items-center pt-32 pb-20;
    }

    &:after {
      transition: opacity 2.5s ease;
      transition-delay: 0.75s;
      pointer-events: none;
      background-color: #242943;
      content: "";
      display: block;
      height: 100%;
      left: 0;
      opacity: 0.85;
      position: absolute;
      top: 0;
      width: 100%;
      z-index: 1;
    }

    .inner {
      transition: opacity 1.5s ease, transform 0.5s ease-out, filter 0.5s ease,
        -webkit-filter 0.5s ease;
      margin: 0 auto;
      width: calc(100% - 3em);
      z-index: 10;

      @screen sm {
        width: calc(100% - 6em);
        max-width: 65em;
      }
    }
  }

  #footer {
    background-color: #242943;
    .copyright {
      @apply mt-6 text-xs text-center;

      > div {
        color: rgba(244, 244, 255, 0.2);

        a:not(:hover) {
          border-color: rgba(244, 244, 255, 0.2);
        }
      }
    }
  }

  #two,
  #footer {
    @apply flex items-center justify-center p-16;
  }
}

#main {
  section {
    background-color: #2a2f4a;
  }

  section,
  article {
    &.special {
      text-align: center;
    }
  }

  header {
    &.major {
    }
  }

  .tiles {
    @apply flex flex-wrap;

    article {
      @apply w-full relative;

      @screen sm {
        @apply w-1/2;
      }

      header {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        width: 100%;
        z-index: 5;
        @apply p-10;

        h3 {
          @apply mb-4 flex flex-wrap items-center;
          .icon {
            @apply mr-2;
          }
        }
      }

      background-position: center;
      background-repeat: no-repeat;
      background-size: cover;

      height: 30vh;
      max-height: 30em;
      min-height: 20em;

      &#tile1 {
        background-image: url("~@/assets/landing/pic01.jpg");

        &:before {
          background-color: #6fc3df;
        }
      }
      &#tile2 {
        background-image: url("~@/assets/landing/pic02.jpg");

        &:before {
          background-color: #8d82c4;
        }
      }
      &#tile3 {
        background-image: url("~@/assets/landing/pic03.jpg");

        &:before {
          background-color: #ec8d81;
        }
      }
      &#tile4 {
        background-image: url("~@/assets/landing/pic04.jpg");

        &:before {
          background-color: #e7b788;
        }
      }

      &:before {
        transition: opacity 0.5s ease;
        bottom: 0;
        content: "";
        display: block;
        height: 100%;
        left: 0;
        opacity: 0.7;
        position: absolute;
        width: 100%;
        z-index: 3;
      }

      &:after {
        background-color: #242943;
        opacity: 0.7;
        content: "";
        display: block;
        height: 100%;
        left: 0;
        position: absolute;
        top: 0;
        width: 100%;
        z-index: 2;
      }

      &:hover {
        &:before {
          opacity: 0;
        }
      }
    }
  }
}
</style>