let PREFIX = process.env.REACT_APP_BACKEND_URL_PREFIX

function sortPlanDataByOrder(data) {
    data.sort(function (a, b) {
        if (a.order > b.order) {
            return 1
        }
        if (a.order < b.order) {
            return -1
        }
        return 0
    })
    return data
}

export async function searchPlannerDataByRange(dateFrom, dateTo, planType) {
    const url = PREFIX + `/planner_data/search?plan_type=${planType}&date_from=${dateFrom}&date_to=${dateTo}`
    return fetch(url, {
            credentials: 'include'
        })
        .then(res => {
            if (res.status === 200) {
                return res.json().then((res) => sortPlanDataByOrder(res))
            } else if (res.status === 403) {
                return null
            }
            return []
        })
}

export async function searchPlannerDataByDate(dateStr, planType) {
    const url = PREFIX + `/planner_data/search?date_str=${dateStr}&plan_type=${planType}`
    return fetch(url, {credentials: 'include'})
        .then(res => {
            if (res.status === 200) {
                return res.json().then((res) => sortPlanDataByOrder(res))
            } else if (res.status === 403) {
                return null
            }
            return []
        })
}

export async function checkExistance(dateStr) {
    const url = PREFIX + '/planner_data/exist?date_str=' + dateStr
    return fetch(url, {credentials: 'include'})
        .then(res => res.json())
}

export async function deleteTodoItem(planId) {
    const url = PREFIX + '/planner_data/' + planId + '/'
    return fetch(url, {
        method:'DELETE',
        credentials: 'include',
    })
}

export async function changeTodoItem(planId, text, checked) {
    const url = PREFIX + '/planner_data/' + planId + '/'
    const formData = new FormData()
    formData.append('content', text)
    formData.append('is_finished', checked?1:0)
    return fetch(url, {
        method:'PATCH',
        body: formData,
        credentials: 'include',
    })
}

export async function changeOrder(planId, order) {
    const url = PREFIX + '/planner_data/' + planId + '/'
    const formData = new FormData()
    if (order != null) {
        formData.append('order', order)
    }
    return fetch(url, {
        method:'PATCH',
        body: formData,
        credentials: 'include',
    })
}

export async function changePlanDate(planId, dateStr) {
    const url = PREFIX + '/planner_data/' + planId + '/'
    const formData = new FormData()
    if (dateStr != null) {
        formData.append('plan_date', dateStr)
    }
    return fetch(url, {
        method:'PATCH',
        body: formData,
        credentials: 'include',
    })
}

export async function changeOrders(orderDataList) {
    const url = PREFIX + '/planner_data/change_order/'
    return fetch(url, {
        method: 'PATCH',
        body: JSON.stringify(orderDataList),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    })
}

export async function changePlanType(planId, planType, dateStr) {
    const url = PREFIX + '/planner_data/' + planId + '/'
    const formData = new FormData()
    formData.append('plan_type', planType)
    formData.append('plan_date', dateStr)
    return fetch(url, {
        method:'PATCH',
        body: formData,
        credentials: 'include',
    })
}

export async function addTodoItem(dateStr, planType, text, order) {
    const url = PREFIX + '/planner_data/'
    const formData = new FormData()
    formData.append('content', text)
    formData.append('plan_type', planType)
    formData.append('plan_date', dateStr)
    formData.append('is_finished', 0)
    formData.append('order', order)
    return fetch(url, {
        method:'POST',
        body: formData,
        credentials: 'include',
    }).then(res => {
        if (res.status === 201) {
            return res.json()
        }
        return []
    })
}

export async function authenticate(user_id, passwd) {
    const url = PREFIX + '/login/'
    const formData = new FormData()
    formData.append('username', user_id)
    formData.append('password', passwd)
    return fetch(url, {
        method: 'POST',
        body: formData,
        credentials: 'include',
    })
}

export async function deauthenticate() {
    const url = PREFIX + '/logout/'
    return fetch(url, {
        credentials: 'include',
    })
}

export async function checkAuthenticated() {
    const url = PREFIX + '/check_login/'
    return fetch(url, {
        credentials: 'include',
    })
}