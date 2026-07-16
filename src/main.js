import './style.css'
import { i18nextSetUp } from './init'
import 'bootstrap/dist/css/bootstrap.min.css'
import { initView } from './view'
import { autoRefreshRss } from './feedService'

i18nextSetUp().then(() => {
  initView()
  autoRefreshRss()
})
