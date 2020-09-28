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
    user: "",
    userInfo: "",
    questions: [],
    videos: [],
    audios: [],
    coverletters: [],
    fullcourses: [],
    results: [],
    videoResult: "",
    audioResult: "",
    coverletterResult: "",
    fullcourseResult: "",
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
    GET_USER(state, userInfo) {
      state.userInfo = userInfo;
    },
    GET_QUESTIONS(state, questions) {
      state.questions = questions;
    },
    GET_VIDEOS(state, videos) {
      state.videos = videos;
    },
    GET_VIDEO_RESULT(state, videoResult) {
      state.videoResult = videoResult;
    },
    GET_AUDIOS(state, audios) {
      state.audios = audios;
    },
    GET_AUDIO_RESULT(state, audioResult) {
      state.audioResult = audioResult;
    },
    GET_COVERLETTERS(state, coverletters) {
      state.coverletters = coverletters;
    },
    GET_COVERLETTER_RESULT(state, coverletterResult) {
      state.coverletterResult = coverletterResult;
    },
    GET_FULLCOURSES(state, fullcourses) {
      state.fullcourses = fullcourses;
    },
    GET_FULLCOURSES_RESULT(state, fullcourseResult) {
      state.fullcourseResult = fullcourseResult;
    },
    GET_RESULTS(state, results) {
      state.results = results;
    },
  },

  actions: {
    // ----- 유저 -----
    // 유저
    getAuth({ commit, dispatch }, info) {
      axios
        .post(BACKEND.URL + info.location, info.data)
        .then((res) => {
          commit("SET_TOKEN", res.data.token);
          commit("SET_AUTH", res.data.user.id);
          commit("SET_USER", res.data.user);
          dispatch("getUser");
        })
        .catch((err) => {
          console.log(err);
        });
    },

    //유저 정보 받아오기
    getUser({ getters, commit }) {
      axios
        .get(BACKEND.URL + BACKEND.ROUTES.user, getters.config)
        .then((response) => {
          commit("GET_USER", response.data);
        })
        .catch((error) => {
          console.log(error);
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

    // 회원정보수정
    updateUser({ getters }, updatedUserData) {
      console.log(updatedUserData)
      axios
        .put(
          BACKEND.URL + BACKEND.ROUTES.user + `${cookies.get('authCheck')}`,
          updatedUserData,
          getters.config
        )
        .then(() => {
          router.go();
        })
        .catch((error) => {
          console.log(error);
        });
    },

    // ----- 질문 ----- URL을 나중에 question으로 바꾸기
    // 질문 리스트
    getQuestions({ getters, commit }) {
      axios
        .get(BACKEND.URL + BACKEND.ROUTES.questions, getters.config)
        .then((response) => {
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
          BACKEND.URL + BACKEND.ROUTES.questions,
          questionData,
          getters.config
        )
        .then(() => {})
        .catch((err) => console.log(err));
    },

    // 질문 삭제
    deleteQuestion({ getters, commit }, question_id) {
      axios
        .delete(
          BACKEND.URL + BACKEND.ROUTES.questions + `${question_id}`,
          getters.config
        )
        .then(() => {
          axios
            .get(BACKEND.URL + BACKEND.ROUTES.questions, getters.config)
            .then((response) => {
              commit("GET_QUESTIONS", response.data);
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    },

    // ----- 영상 분석 -----
    // 영상 리스트
    getVideos({ getters, commit }) {
      axios
        .get(BACKEND.URL + BACKEND.ROUTES.videos, getters.config)
        .then((response) => {
          console.log(response, "영상 리스트");
          commit("GET_VIDEOS", response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    },

    // 영상 분석 시작
    createVideo({ getters }, videoData) {
      console.log(videoData, "영상 분석 Inputs");
      for (var pair of videoData.entries()) {
        console.log(pair[0] + "," + pair[1], "영상 분석 FormData 내용들");
      }
      axios
        .post(BACKEND.URL + BACKEND.ROUTES.videos, videoData, getters.config)
        .then(() => {
          router.push("/videos/list/");
        })
        .catch((error) => {
          console.log(error);
        });
    },

    // 영상 분석 결과
    getVideoResult({ getters, commit }, video_id) {
      axios
        .get(
          BACKEND.URL + BACKEND.ROUTES.videos + `${video_id}`,
          getters.config
        )
        .then((response) => {
          console.log(response, "영상 분석 결과");
          commit("GET_VIDEO_RESULT", response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    },

    // 영상 분석 삭제
    deleteVideo({ getters }, video_id) {
      axios
        .delete(
          BACKEND.URL + BACKEND.ROUTES.videos + `${video_id}`,
          getters.config
        )
        .then(() => {
          router.push(`/videos/list/`);
          router.go();
        })
        .catch((err) => {
          console.log(err);
        });
    },

    // ----- 음성 분석 -----
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
    createAudio({ getters }, audioData) {
      console.log(audioData, "음성 분석 Inputs");
      for (var pair of audioData.entries()) {
        console.log(pair[0] + "," + pair[1], "음성 분석 FormData 내용들");
      }
      axios
        .post(BACKEND.URL + BACKEND.ROUTES.audios, audioData, getters.config)
        .then(() => {
          router.push("/audios/list/");
        })
        .catch((error) => {
          console.log(error);
        });
    },

    // 음성 분석 결과
    getAudioResult({ getters, commit }, audio_id) {
      axios
        .get(
          BACKEND.URL + BACKEND.ROUTES.audios + `${audio_id}`,
          getters.config
        )
        .then((response) => {
          console.log(response, "음성 분석 결과");
          commit("GET_AUDIO_RESULT", response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    },

    // 음성 분석 삭제
    deleteAudio({ getters }, audio_id) {
      axios
        .delete(
          BACKEND.URL + BACKEND.ROUTES.audios + `${audio_id}`,
          getters.config
        )
        .then(() => {
          router.push(`/audio/list/`);
          router.go();
        })
        .catch((err) => {
          console.log(err);
        });
    },

    // ----- 자소서 분석 -----
    // 자소서 분석 리스트
    getCoverletters({ getters, commit }) {
      axios
        .get(BACKEND.URL + BACKEND.ROUTES.coverletters, getters.config)
        .then((response) => {
          console.log(response, "자소서 리스트");
          commit("GET_COVERLETTERS", response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    },

    // 자소서 분석 시작
    createCoverletter({ getters }, coverletterData) {
      console.log(coverletterData, "자소서 분석 Inputs");
      axios
        .post(
          BACKEND.URL + BACKEND.ROUTES.coverletters,
          coverletterData,
          getters.config
        )
        .then(() => {
          router.push("/coverletters/list/");
        })
        .catch((error) => {
          console.log(error);
        });
    },

    // 자소서 분석 결과
    getCoverletterResult({ getters, commit }, coverletter_id) {
      axios
        .get(
          BACKEND.URL + BACKEND.ROUTES.coverletters + `${coverletter_id}`,
          getters.config
        )
        .then((response) => {
          console.log(response, "자소서 분석 결과");
          commit("GET_COVERLETTER_RESULT", response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    },

    // 자소서 분석 수정
    updateCoverletter({ getters }, updatedCoverletterData) {
      console.log(updatedCoverletterData, "1111111111111111111");
      axios
        .put(
          BACKEND.URL +
            BACKEND.ROUTES.coverletters +
            `${updatedCoverletterData.id}`,
          updatedCoverletterData,
          getters.config
        )
        .then(() => {
          router.push(`/coverletters/detail/${updatedCoverletterData.id}`);
        })
        .catch((error) => {
          console.log(error);
        });
    },

    // 자소서 분석 삭제
    deleteCoverletter({ getters }, coverletter_id) {
      axios
        .delete(
          BACKEND.URL + BACKEND.ROUTES.coverletters + `${coverletter_id}`,
          getters.config
        )
        .then(() => {
          router.push(`/coverletters/list/`);
          router.go();
        })
        .catch((err) => {
          console.log(err);
        });
    },

    // ----- 풀코스 분석 -----
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
    createFullcourse({ getters }, fullcourseData) {
      console.log(fullcourseData, "풀코스 분석 Inputs");
      for (var pair of fullcourseData.entries()) {
        console.log(pair[0] + "," + pair[1], "풀코스 분석 FormData 내용들");
      }
      axios
        .post(
          BACKEND.URL + BACKEND.ROUTES.fullcourses,
          fullcourseData,
          getters.config
        )
        .then(() => {
          router.push("/fullcourses/list/");
        })
        .catch((error) => {
          console.log(error);
        });
    },

    // 풀코스 결과
    getFullcourseResult({ getters, commit }, fullcourse_id) {
      axios
        .get(
          BACKEND.URL + BACKEND.ROUTES.fullcourses + `${fullcourse_id}`,
          getters.config
        )
        .then((response) => {
          console.log(response, "풀코스 분석 결과");
          commit("GET_FULLCOURSE_RESULT", response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    },

    // 풀코스 삭제
    deleteFullcourse({ getters }, fullcourse_id) {
      axios
        .delete(
          BACKEND.URL + BACKEND.ROUTES.fullcourses + `${fullcourse_id}`,
          getters.config
        )
        .then(() => {
          router.push(`/fullcourse/list/`);
          router.go();
        })
        .catch((err) => {
          console.log(err);
        });
    },

    // ----- 통계 및 결과 -----
    getResults({ getters, commit }) {
      axios
        .get(BACKEND.URL + BACKEND.ROUTES.results, getters.config)
        .then((response) => {
          console.log(response, "결과");
          commit("SET_RESULTS", response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },

  modules: {},
});
