<template>
  <q-page>
    <!-- Hero Section com imagem de fundo -->
    <section class="hero-section text-white text-center q-pa-xl">
      <div class="hero-content">
        <h1 class="text-h3 text-weight-bold q-mb-md">MocPesquisa</h1>
        <p class="text-h5 q-mb-md">
          Colete dados para suas pesquisas acadêmicas de forma rápida e remunerada em Moçambique!
        </p>
        <p class="text-h6 q-mb-lg">
          Conectamos estudantes que precisam de dados para suas pesquisas com pessoas dispostas a participar e ganhar dinheiro.
        </p>
        
        <div class="q-mt-lg">
          <q-btn 
            color="white" 
            text-color="primary" 
            label="Cadastrar como Estudante" 
            class="q-mr-md" 
            size="lg"
            icon="school"
          />
          <q-btn 
            color="green" 
            text-color="white" 
            label="Cadastrar como Participante" 
            size="lg"
            icon="person"
          />
        </div>
      </div>
    </section>

    <!-- Para Estudantes -->
    <section class="q-pa-xl">
      <h2 class="text-h4 text-center q-mb-lg text-weight-bold">Para Estudantes</h2>
      <p class="text-center q-mb-lg text-h6 text-grey-7">
        Facilite a coleta de dados para seu TCC, dissertação ou projeto de pesquisa
      </p>
      
      <div class="row q-col-gutter-lg">
        <div class="col-12 col-md-4" v-for="feature in studentFeatures" :key="feature.title">
          <q-card class="text-center q-pa-md" flat bordered>
            <q-card-section>
              <FeatureIcon :icon="feature.icon" />
              <div class="text-h6 text-weight-bold text-primary q-mb-sm">{{ feature.title }}</div>
              <p class="q-mt-sm text-grey-7">{{ feature.description }}</p>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </section>

    <!-- Para Participantes -->
    <section class="q-pa-xl bg-grey-2">
      <h2 class="text-h4 text-center q-mb-lg text-weight-bold">Para Participantes</h2>
      <p class="text-center q-mb-lg text-h6 text-grey-7">
        Ganhe dinheiro no seu tempo livre respondendo pesquisas acadêmicas
      </p>
      
      <div class="row q-col-gutter-lg">
        <div class="col-12 col-md-4" v-for="feature in participantFeatures" :key="feature.title">
          <q-card class="text-center q-pa-md">
            <q-card-section>
              <FeatureIcon :icon="feature.icon" />
              <div class="text-h6 text-weight-bold text-primary q-mb-sm">{{ feature.title }}</div>
              <p class="q-mt-sm text-grey-7">{{ feature.description }}</p>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </section>

    <!-- Depoimentos -->
    <section class="q-pa-xl">
      <h2 class="text-h4 text-center q-mb-lg text-weight-bold">O que nossos usuários dizem</h2>
      
      <div class="row q-col-gutter-lg">
        <div class="col-12 col-md-4" v-for="testimonial in testimonials" :key="testimonial.name">
          <q-card class="q-pa-md testimonial-card">
            <q-card-section>
              <!-- Estrelas de classificação -->
              <div class="rating-stars q-mb-sm">
                <q-icon 
                  v-for="star in 5" 
                  :key="star" 
                  name="star" 
                  size="sm"
                  :color="star <= testimonial.rating ? 'amber-5' : 'grey-3'"
                  class="q-mr-xs"
                />
              </div>
              
              <div class="text-weight-bold text-primary q-mb-xs">Moz-Pesquisa</div>
              <p class="text-grey-8 q-mb-lg testimonial-text">"{{ testimonial.text }}"</p>
              <div class="text-weight-bold testimonial-name">{{ testimonial.name }}</div>
              <div class="text-caption text-grey-6 testimonial-role">{{ testimonial.role }}</div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </section>

    <!-- Call to Action -->
    <section class="text-center q-pa-xl" style="background: #003366; color: white;">
      <h2 class="text-h4 q-mb-md text-weight-bold">Pronto para começar?</h2>
      <p class="q-mb-lg text-h6">
        Junte-se a centenas de estudantes e participantes que já estão usando o MocPesquisa
      </p>
      
      <div>
        <q-btn 
          color="white" 
          text-color="primary" 
          label="Sou Estudante" 
          class="q-mr-md" 
          size="lg"
          icon="school"
        />
        <q-btn 
          color="green" 
          text-color="white" 
          label="Quero Participar" 
          size="lg"
          icon="person"
        />
      </div>
    </section>

   
  </q-page>
</template>

<script setup lang="ts">
import FeatureIcon from 'components/FeatureIcon.vue'

const studentFeatures = [
  {
    icon: 'assignment',
    title: 'Publique suas Pesquisas',
    description: 'Crie formulários e defina o público-alvo específico para sua pesquisa acadêmica'
  },
  {
    icon: 'payments',
    title: 'Pague por Respostas',
    description: 'Defina um valor por resposta e obtenha dados de qualidade rapidamente'
  },
  {
    icon: 'speed',
    title: 'Resultados Rápidos',
    description: 'Colete centenas de respostas em dias, não em semanas ou meses'
  }
]

const participantFeatures = [
  {
    icon: 'savings',
    title: 'Ganhe MZN',
    description: 'Receba pagamentos direto no seu M-Pesa por cada pesquisa respondida'
  },
  {
    icon: 'schedule',
    title: 'Flexibilidade',
    description: 'Responda pesquisas quando e onde quiser, no seu próprio ritmo'
  },
  {
    icon: 'school',
    title: 'Contribua para a Ciência',
    description: 'Ajude estudantes moçambicanos a completar suas pesquisas acadêmicas'
  }
]

const testimonials = [
  {
    text: 'Facilitou enormemente meu TCC! Consegui 200 respostas em apenas 3 dias.',
    name: 'João Nhampossa',
    role: 'Estudante de Engenharia Informática - UBA',
    rating: 5
  },
  {
    text: 'Ganho um dinheiro extra respondendo pesquisas no meu tempo livre. Muito prático!',
    name: 'Maria Chissano', 
    role: 'Participante - Maputo',
    rating: 5
  },
  {
    text: 'Consegui os dados que precisava para minha pesquisa de forma rápida e confiável.',
    name: 'Anuário Mondlane',
    role: 'Estudante de Medicina - UP',
    rating: 5
  }
]
</script>

<style scoped lang="scss">
.hero-section {
  background: linear-gradient(rgba(0, 51, 102, 0.8), rgba(0, 51, 102, 0.8)), 
              url('https://mozpesquisa-hub.lovable.app/assets/hero-background-BxL6hfkY.jpg');
  background-size: cover;
  background-position: center;
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-content {
  max-width: 800px;
}

footer a {
  text-decoration: none;
  transition: opacity 0.3s;

  &:hover {
    opacity: 0.8;
  }
}

/* Estilos para os depoimentos */
.testimonial-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  height: 100%;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  }
}

.rating-stars {
  display: flex;
  justify-content: center;
}

.testimonial-text {
  font-style: italic;
  line-height: 1.5;
  min-height: 80px;
}

.testimonial-name {
  color: #003366;
  font-size: 1.1em;
}

.testimonial-role {
  font-size: 0.9em;
}
</style>