import './style.css'
import { i18nextSetUp } from './init'
import 'bootstrap/dist/css/bootstrap.min.css'
import { initView } from './view'
import { autoRefreshRss } from './feedService'
import { createAppState } from './models/appState'

i18nextSetUp().then(() => {
  const appState = createAppState()
  initView(appState)
  // autoRefreshRss(appState)
})
