import { defineStore } from 'pinia';
import { computed } from 'vue';
import { Notify } from 'quasar';
import { sharedSurveys, saveSharedData, generateId } from './base-store';
import type { Survey } from '../types/shared/shared';
import { useUserStore } from './user-store'; // ADICIONAR esta importação

export const useStudentStore = defineStore('student', () => {
  // ADICIONAR esta linha para inicializar a userStore
  const userStore = useUserStore();

  // State
  const studentSurveys = computed(() => {
    return sharedSurveys.value.filter((survey) => survey.creatorId === userStore.user?.id);
  });

  const availableSurveys = computed(() => {
    return sharedSurveys.value.filter(
      (survey) => survey.creatorId !== userStore.user?.id && survey.status === 'active',
    );
  });

  const studentStats = computed(() => {
    const mySurveys = studentSurveys.value;
    const totalSurveys = mySurveys.length;
    const completedSurveys = mySurveys.filter((s) => s.responses >= s.target).length;
    const totalResponses = mySurveys.reduce((sum, s) => sum + s.responses, 0);
    const totalEarned = mySurveys.reduce((sum, s) => sum + s.responses * (s.reward || 0), 0);

    return {
      totalSurveys,
      completedSurveys,
      totalResponses,
      totalEarned,
      completionRate: totalSurveys > 0 ? Math.round((completedSurveys / totalSurveys) * 100) : 0,
      averageTime: '2.3 dias',
      satisfaction: '4.8/5',
    };
  });

  // Actions
  const createSurvey = (surveyData: {
    title: string;
    googleFormLink: string;
    targetResponses: number;
    reward: number;
    targetAudience: string;
  }) => {
    if (!userStore.user) {
      throw new Error('Usuário não autenticado');
    }

    const newSurvey: Survey = {
      id: generateId(),
      title: surveyData.title,
      googleFormLink: surveyData.googleFormLink,
      target: surveyData.targetResponses,
      reward: surveyData.reward,
      responses: 0,
      status: 'active',
      creatorId: userStore.user.id,
      creatorName: userStore.user.name || userStore.user.email,
      targetAudience: surveyData.targetAudience,
      createdDate: new Date().toLocaleDateString('pt-BR'),
      category: 'academic',
    };

    sharedSurveys.value.push(newSurvey);
    saveSharedData();

    return newSurvey;
  };

  const deleteSurvey = (surveyId: string) => {
    const surveyIndex = sharedSurveys.value.findIndex((s) => s.id === surveyId);
    if (surveyIndex > -1) {
      sharedSurveys.value.splice(surveyIndex, 1);
      saveSharedData();

      Notify.create({
        type: 'positive',
        message: 'Pesquisa excluída com sucesso!',
        position: 'top',
      });
    }
  };

  const updateSurvey = (surveyId: string, updates: Partial<Survey>) => {
    const survey = sharedSurveys.value.find((s) => s.id === surveyId);
    if (survey) {
      Object.assign(survey, updates);
      saveSharedData();

      Notify.create({
        type: 'positive',
        message: 'Pesquisa atualizada com sucesso!',
        position: 'top',
      });
    }
  };

  const participateInSurvey = (surveyId: string) => {
    const survey = sharedSurveys.value.find((s) => s.id === surveyId);
    if (survey) {
      survey.responses += 1;
      saveSharedData();

      Notify.create({
        type: 'positive',
        message: 'Participação registrada com sucesso!',
        position: 'top',
      });

      return survey.reward || 0;
    }
    return 0;
  };

  return {
    // Computed
    studentSurveys,
    availableSurveys,
    studentStats,

    // Actions
    createSurvey,
    deleteSurvey,
    updateSurvey,
    participateInSurvey,
  };
});
