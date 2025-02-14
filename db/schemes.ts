type projectData = {
    id: number,
    number: number,
    text_value: string,
    is_ender_chest: boolean
}

type projectMember = {
    user_id: string
    name: string
}

type project = {
    project_uuid: string,
    project_name: string,
    icon_id: number
}

type userData = {
    id: string,
    user_id: string,
    user_name: string
}

export type {projectData, projectMember, project, userData}