import Vue from "vue";
import Vuex from "vuex";
import cookies from "vue-cookies";
import axios from "axios";
import BACKEND from "@/api/index";
import router from "@/router";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    accessToken: cookies.get("accessToken"),
    authCheck: "",
    questions: [],
    videos: [],
    audios: [],
    coverletters: [],
    fullcourses: [],
    results: [],
  },

  getters: {
    isLoggedIn: (state) => !!state.accessToken || !!state.authCheck,
    config: () => ({
      headers: { Authorization: `JWT ${cookies.get("accessToken")}` },
    }),
  },

  mutations: {
    SET_TOKEN(state, token) {
      state.accessToken = token;
      cookies.set("accessToken", token);
    },
    SET_AUTH(state, id) {
      state.authCheck = id;
      cookies.set("authCheck", id);
    },
    SET_USER(state, user) {
      state.user = user;
    },
    GET_QUESTIONS(state, questions) {
      state.questions = questions;
    },
    GET_VIDEOS(state, videos) {
      state.videos = videos;
    },
    GET_AUDIOS(state, audios) {
      state.audios = audios;
    },
    GET_COVERLETTERS(state, coverletters) {
      state.coverletters = coverletters;
    },
    GET_FULLCOURSES(state, fullcourses) {
      state.fullcourses = fullcourses;      
    },
    GET_RESULTS(state, results) {
      state.results = results;
    },
  },

  actions: {
    // ----- 유저 -----

    // 유저
    getAuth({ commit }, info) {
      axios
        .post(BACKEND.URL + info.location, info.data)
        .then((res) => {
          console.log(res);
          commit("SET_TOKEN", res.data.token);
          commit("SET_AUTH", res.data.user.id);
          commit("SET_USER", res.data.user);
        })
        .catch((err) => {
          console.log(err);
        });
    },

    // 회원가입
    signup({ dispatch }, signupData) {
      const info = {
        data: signupData,
        location: BACKEND.ROUTES.signup,
      };
      dispatch("getAuth", info);
      router.go();
    },

    // 로그인
    login({ dispatch }, loginData) {
      const info = {
        data: loginData,
        location: BACKEND.ROUTES.login,
      };
      dispatch("getAuth", info);
    },

    // 로그아웃
    logout({ commit }) {
      commit("SET_TOKEN", null);
      commit("SET_AUTH", null);
      cookies.remove("accessToken");
      cookies.remove("authCheck");
      router.push({ name: "Home" });
      router.go();
    },

    // 회원정보수정 - 해야함

    // 질문

    // 질문 리스트
    getQuestions({ getters, commit }) {
      axios
        .get(
          BACKEND.URL + BACKEND.ROUTES.interview + "questions",
          getters.config
        )
        .then((response) => {
          console.log(response, "질문 리스트");
          commit("GET_QUESTIONS", response.data);
        })
        .catch((err) => {
          console.log(err);
        });
    },

    // 질문 추가
    createQuestion({ getters }, questionData) {
      axios
        .post(
          BACKEND.URL + BACKEND.ROUTES.interview + "questions",
          questionData,
          getters.config
        )
        .then(() => {
          console.log("질문 추가 성공");
        })
        .catch((err) => console.log(err));
    },

    // 질문 삭제
    deleteQuestion({ getters }, question_id) {
      axios
        .delete(
          BACKEND.URL + BACKEND.ROUTES.interview + `${question_id}`,
          getters.config
        )
        .then(() => {
          console.log('삭제완료')
        })
        .catch((err) => {
          console.log(err);
        });
    },
    
    // 영상 분석
    
    // 영상 리스트
    getVideos({ getters, commit }) {
      axios
        .get(BACKEND.URL + BACKEND.ROUTES.videos, getters.config)
        .then((response) => {
          console.log(response, "영상 리스트");
          commit("SET_VIDEOS", response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    // 영상 분석 시작
    // 영상 분석 결과
    // 영상 분석 삭제

    // 음성 분석

    // 음성 리스트
    getAudios({ getters, commit }) {
      axios
        .get(BACKEND.URL + BACKEND.ROUTES.audios, getters.config)
        .then((response) => {
          console.log(response, "음성 리스트");
          commit("SET_AUDIOS", response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    // 음성 분석 시작
    // 음성 분석 결과
    // 음성 분석 삭제

    // 자소서 분석

    // 자소서 분석 리스트
    getCoverletters({ getters, commit }) {
      axios
        .get(BACKEND.URL + BACKEND.ROUTES.coverletters, getters.config)
        .then((response) => {
          console.log(response, "자소서 리스트");
          commit("SET_COVERLETTERS", response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    // 자소서 분석 시작
    // 자소서 분석 결과
    // 자소서 분석 수정
    // 자소서 분석 삭제

    // 풀코스 분석

    // 풀코스 리스트
    getFullcourses({ getters, commit }) {
      axios
        .get(BACKEND.URL + BACKEND.ROUTES.fullcourses, getters.config)
        .then((response) => {
          console.log(response, "풀코스 리스트");
          commit("SET_FULLCOURSES", response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    // 풀코스 시작
    // 풀코스 결과
    // 풀코스 삭제

    // 통계 및 결과

  },
  modules: {
  }
})
