const state = {
    visitedViews: [],
    cachedViews: []
}

const mutations = {
    INIT_CACHED_VIEW: (state, views) => {
        state.cachedViews = views
    },
    ADD_VISITED_VIEW: (state, view) => {
        if (
            state.visitedViews.some((v) => {
                // 新增/编辑时 导航栏做区分
                // example: 商城管理->消息管理->公告管理->新增/编辑公告
                if (v.path === view.path) {
                    v.title = view.meta.title
                    return true
                } else {
                    return false
                }
            })
        ) {
            return
        }
        state.visitedViews.push(
            Object.assign({}, view, {
                title: view.meta.title || 'no-name'
            })
        )
    },
    ADD_CACHED_VIEW: (state, view) => {
        if (state.cachedViews.includes(view.name)) return
        if (!view.meta.noCache) {
            state.cachedViews.push(view.name)
        }
    },

    DEL_VISITED_VIEW: (state, view) => {
        for (const [i, v] of state.visitedViews.entries()) {
            if (v.path === view.path) {
                state.visitedViews.splice(i, 1)
                break
            }
        }
    },
    DEL_CACHED_VIEW: (state, view) => {
        const index = state.cachedViews.indexOf(view.name)
        index > -1 && state.cachedViews.splice(index, 1)
    },

    DEL_OTHERS_VISITED_VIEWS: (state, view) => {
        state.visitedViews = state.visitedViews.filter((v) => {
            return v.meta.affix || v.path === view.path
        })
    },
    DEL_OTHERS_CACHED_VIEWS: (state, view) => {
        const index = state.cachedViews.indexOf(view.name)
        if (index > -1) {
            state.cachedViews = state.cachedViews.slice(index, index + 1)
        } else {
            // if index = -1, there is no cached tags
            state.cachedViews = []
        }
    },

    DEL_ALL_VISITED_VIEWS: (state) => {
        // keep affix tags
        const affixTags = state.visitedViews.filter((tag) => tag.meta.affix)
        state.visitedViews = affixTags
    },
    DEL_ALL_CACHED_VIEWS: (state) => {
        state.cachedViews = []
    },

    UPDATE_VISITED_VIEW: (state, view) => {
        for (let v of state.visitedViews) {
            if (v.path === view.path) {
                v = Object.assign(v, view)
                break
            }
        }
    }
}

const actions = {
    initCachedViews({ commit }, views) {
        commit('INIT_CACHED_VIEW', views)
    },
    addView({ dispatch }, view) {
        dispatch('addVisitedView', view)
        dispatch('addCachedView', view)
    },
    addVisitedView({ commit }, view) {
        commit('ADD_VISITED_VIEW', view)
    },
    addCachedView({ commit }, view) {
        // if (view.matched && view.matched.length >= 3) { // 若为三级及其以上路由点击打开标签页时，将三级路由或以上的根目录路由塞入缓存路由name list中
        //   commit('ADD_CACHED_VIEW', view.matched[1])
        //  }
        commit('ADD_CACHED_VIEW', view) // 反之，正常的进行标签页的添加进缓存路由name list中
    },

    delView({ dispatch, state }, view) {
        return new Promise((resolve) => {
            dispatch('delVisitedView', view)
            dispatch('delCachedView', view)
            resolve({
                visitedViews: [...state.visitedViews],
                cachedViews: [...state.cachedViews]
            })
        })
    },
    delVisitedView({ commit, state }, view) {
        return new Promise((resolve) => {
            commit('DEL_VISITED_VIEW', view)
            resolve([...state.visitedViews])
        })
    },
    delCachedView({ commit, state }, view) {
        return new Promise((resolve) => {
            //   if (view.matched && view.matched.length >= 3) { // 若为三级及其以上路由关闭当前标签页时，将3级路由以上的根目录name 从list中删除
            //   commit('DEL_CACHED_VIEW', view.matched[1])
            // }
            commit('DEL_CACHED_VIEW', view) // 反之，正常的进行标签页的name 从list中删除
            resolve([...state.cachedViews])
        })
    },

    delOthersViews({ dispatch, state }, view) {
        return new Promise((resolve) => {
            dispatch('delOthersVisitedViews', view)
            dispatch('delOthersCachedViews', view)
            resolve({
                visitedViews: [...state.visitedViews],
                cachedViews: [...state.cachedViews]
            })
        })
    },
    delOthersVisitedViews({ commit, state }, view) {
        return new Promise((resolve) => {
            commit('DEL_OTHERS_VISITED_VIEWS', view)
            resolve([...state.visitedViews])
        })
    },
    delOthersCachedViews({ commit, state }, view) {
        return new Promise((resolve) => {
            commit('DEL_OTHERS_CACHED_VIEWS', view)
            resolve([...state.cachedViews])
        })
    },

    delAllViews({ dispatch, state }, view) {
        return new Promise((resolve) => {
            dispatch('delAllVisitedViews', view)
            dispatch('delAllCachedViews', view)
            resolve({
                visitedViews: [...state.visitedViews],
                cachedViews: [...state.cachedViews]
            })
        })
    },
    delAllVisitedViews({ commit, state }) {
        return new Promise((resolve) => {
            commit('DEL_ALL_VISITED_VIEWS')
            resolve([...state.visitedViews])
        })
    },
    delAllCachedViews({ commit, state }) {
        return new Promise((resolve) => {
            commit('DEL_ALL_CACHED_VIEWS')
            resolve([...state.cachedViews])
        })
    },

    updateVisitedView({ commit }, view) {
        commit('UPDATE_VISITED_VIEW', view)
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
