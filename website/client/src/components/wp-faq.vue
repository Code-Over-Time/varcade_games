<template>

<div class="faq-content">
  
  <div class="row justify-content-center">
    <h1 class="faq-header">Frequently Asked Questions</h1>
  </div>

  <div class="row justify-content-center">
      <div class="accordion faq-container" role="tablist">
        <b-card no-body class="bg-dark faq-entry">
          <b-card-header header-tag="header" class="bg-dark" role="tab">
            <b-button block v-b-toggle.accordion-1 variant="dark" class="faq-question ">
                {{ q1 }}
            </b-button>
          </b-card-header>
          <b-collapse id="accordion-1" visible accordion="my-accordion" role="tabpanel">
            <b-card-body>
              <b-card-text>{{ a1p1 }}</b-card-text>
              <b-card-text>{{ a1p2 }}</b-card-text>
            </b-card-body>
          </b-collapse>
        </b-card>

        <b-card no-body class="bg-dark faq-entry">
          <b-card-header header-tag="header" class="bg-dark" role="tab">
            <b-button block v-b-toggle.accordion-2 variant="dark" class="faq-question">
                {{ q2 }}
            </b-button>
          </b-card-header>
          <b-collapse id="accordion-2" accordion="my-accordion" role="tabpanel">
            <b-card-body>
              <b-card-text>
                {{ a2p1 }}
                <a href="https://codeovertime.com" target="_blank">CodeOverTime.com</a>
              </b-card-text>
              <b-card-text>{{ a2p2 }}</b-card-text>
            </b-card-body>
          </b-collapse>
        </b-card>

        <b-card no-body class="bg-dark faq-entry">
          <b-card-header header-tag="header" class="bg-dark" role="tab">
            <b-button block v-b-toggle.accordion-3 variant="dark" class="faq-question ">
                {{ q3 }}
            </b-button>
          </b-card-header>
          <b-collapse id="accordion-3" accordion="my-accordion" role="tabpanel">
            <b-card-body>
              <b-card-text>{{ a3p1 }}</b-card-text>
              <b-card-text>{{ a3p2 }}</b-card-text>
            </b-card-body>
          </b-collapse>
        </b-card>
      </div>
  </div>
</div>   
</template>

<script>

    export default {
        name: 'faq',
        data () {
            return {
                q1: "What is Varcade Games?",
                q2: "What is Code Over Time?",
                q3: "Can I actually log in and play?",
                a1p1: "Varcade Games in an online gaming portal that hosts single player and multi player arcade style games. By arcade style, we mean the old arcade games where you put a coin in a slot and try to beat the game (or your friends!).",
                a1p2: "HOWEVER - Varcade Games is not a real product, it is a part of the education platform 'Code Over Time'. It is a demo of a product, used as a teaching tool for aspiring programmers. Varcade Games was created as a real world project that intermediate programmers can use to prepare for entering the real world of software engineering.",
                a2p1: "Code Over Time is an online simulation of an internship for software engineers and is available at ",
                a2p2: "Through working with Code Over Time, aspiring programmers get to experience what it is like to work on a real software project - ie. Varcade Games.",
                a3p1: "Yes! This website is fully functional. You can log in and play 'Rock Paper Scissors Apocalypse'. It even supports online multi-player gameplay!.",
                a3p2: "Note: This is a dev server so it may be reset at any time and you could lose your account. Also you should avoid using a real email address or personal information to create an account."
            }
        },
        methods: {
            
        },
        computed: {
          
        },
        mounted: function () {
        },
        created: function () {
        }
    }

</script>

<style scoped>

    .faq-content {
        padding: 4rem;
        background-color: black;
        border-bottom: 8px solid #222;
    }

    .faq-entry {
        margin-bottom: 0.5rem;
    }

    .faq-header {
        font-weight: bold;
        font-size: 3.1rem;
        line-height: 1.1;
        margin-bottom: 0.5rem;
        text-align: center;
    }

    .faq-question {
        font-size: 32px;
        font-weight: bold;
        text-align: left;
    }

    .faq-container {
        max-width: 960px;
        width: 100%;
        padding: 2rem;
        font-size: 22px;
    }

    @media only screen 
    and (max-device-width : 800px) {
        .faq-header {
            font-size: 2.5rem;
        }

        .faq-question {
            font-size: 1.5rem;
        }

        .faq-container {
            font-size: 1.2rem;
        }

        .faq-container {
          max-width: 100%;
          width: 100%;
          padding:  2rem 0;
        }

    }

    @media only screen 
    and (max-device-width : 500px) {
        .faq-header {
            font-size: 2rem;
        }

        .faq-question {
            font-size: 1.2rem;
        }

        .faq-container {
          font-size: 1rem;
        }

        .faq-content {
          padding: 3rem;
      }
    }

</style>
