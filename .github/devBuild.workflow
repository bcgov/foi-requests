workflow "New workflow" {
  on = "push"
  resolves = ["HTTP client"]
}

action "filter" {
  uses = "actions/bin/filter@master"
  args = "branch dev"
}

action "HTTP client" {
  uses = "swinton/httpie.action@8ab0a0e926d091e0444fcacd5eb679d2e2d4ab3d"
  needs = ["filter"]
  args = ["POST", "console.pathfinder.gov.bc.ca:8443/oapi/v1/namespaces/6ni3xg-dev/buildconfigs/foi-requests-build/webhooks/godev1/github", "new=commit"]
}
