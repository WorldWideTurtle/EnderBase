type projectData = {
    id: string,
    project_id: string,
    number: string,
    text_value: string
}

type projectMember = {
    id: string,
    project_id: string,
    user_id: string,
    user_role: string
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