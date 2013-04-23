# encoding: utf-8

# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant::Config.run do |config|

  config.vm.box = "precise64"
  config.vm.box_url = "http://files.vagrantup.com/precise64.box"
  config.ssh.forward_agent = true

  config.vm.forward_port 80, 8888

  config.vm.provision :chef_solo do |chef|
    chef.cookbooks_path = ["cookbooks"]
    chef.add_recipe :apt
    chef.add_recipe 'git'
    chef.add_recipe 'postgresql::client'
    chef.add_recipe 'postgresql::server'
    chef.add_recipe 'python'
    chef.add_recipe 'nginx'
    chef.add_recipe 'supervisor'
    chef.add_recipe 'onionornot'
    chef.json = {
      :git        => {
        :prefix => "/usr/local"
      },
      :postgresql => {
        :config   => {
          :listen_addresses => "*",
          :port             => "5432"
        },
        :pg_hba   => [
          {
            :type   => "local",
            :db     => "postgres",
            :user   => "postgres",
            :addr   => nil,
            :method => "trust"
          },
          {
            :type   => "host",
            :db     => "all",
            :user   => "all",
            :addr   => "0.0.0.0/0",
            :method => "md5"
          },
          {
            :type   => "host",
            :db     => "all",
            :user   => "all",
            :addr   => "::1/0",
            :method => "md5"
          }
        ],
        :password => {
          :postgres => "password"
        }
      },
      :nginx      => {
        :dir                => "/etc/nginx",
        :log_dir            => "/var/log/nginx",
        :binary             => "/usr/sbin/nginx",
        :user               => "www-data",
        :init_style         => "runit",
        :pid                => "/var/run/nginx.pid",
        :worker_connections => "1024"
      },
      :supervisor => {
        :service_name       => "Gunicorn",
        :command            => "/vagrant/gunicorn.sh",
        :user               => "vagrant",
        :directory          => "/vagrant/",
        :stdout_logfile     => "/var/log/supervisor/onionornot.log",
        :sterr_logfile      => "/var/log/supervisor/onionornot-error.log",
        :autostart          => true,
        :autorestart        => true
      }
    }
  end

  config.vm.provision :shell, :inline => "sudo cp /vagrant/configs/nginx/sites-enabled/default /etc/nginx/sites-enabled/default"
  config.vm.provision :shell, :inline => "sudo /etc/init.d/nginx reload"

end
