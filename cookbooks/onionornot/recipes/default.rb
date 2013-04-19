include_recipe "python"
include_recipe "supervisor"

execute "install_requirements" do
  cwd "/vagrant/"
  user "root"
  command "pip install -r requirements/local.txt"
end

supervisor_service "gunicorn" do
  action :enable
  command "/vagrant/gunicorn.sh"
  user "vagrant"
  directory "/vagrant/"
  stdout_logfile "/var/log/supervisor/onionornot.log"
  stderr_logfile "/var/log/supervisor/onionornot-err.log"
  autostart true
  autorestart true
end
