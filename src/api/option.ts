import axios from 'axios'
export interface appidParams {
    app_id: number
}

const testAgentList = [17, 18]
export function getTestAgentList() {
    return testAgentList
}

