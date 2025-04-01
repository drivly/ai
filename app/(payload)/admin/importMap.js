import { WorkflowView as WorkflowView_Original } from 'payload-kanban-board/dist/exports/client.js'
import { default as default_f8022cf35b3d492829ec1a405bd134e9 } from '@/components/icon'
import { default as default_7a89b5675912f3f4f82dd41bbb03d52e } from '@/components/logo'
import { I18nWrapper } from './i18n-wrapper'

const WorkflowView = (props) => <I18nWrapper>{({ i18n, t }) => <WorkflowView_Original {...props} />}</I18nWrapper>

export const importMap = {
  "payload-kanban-board/dist/exports/client.js#WorkflowView": WorkflowView,
  "@/components/icon#default": default_f8022cf35b3d492829ec1a405bd134e9,
  "@/components/logo#default": default_7a89b5675912f3f4f82dd41bbb03d52e
}
