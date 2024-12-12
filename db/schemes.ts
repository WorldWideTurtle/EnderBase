type projectData = {
    id: string,
    number: string,
    text_value: string,
    is_ender_chest: boolean
}

type projectMember = {
    user_id: string,
    user_role: number,
    user_name: string
}

type project = {
    project_uuid: string,
    project_name: string
}

type userData = {
    id: string,
    user_id: string,
    user_name: string
}

export type {projectData, projectMember, project, userData}