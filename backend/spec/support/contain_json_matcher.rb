RSpec::Matchers.define :contain_json do |expected_json|
  match do |response|
    @actual = JSON.parse(response.body, symbolize_names: true)
    expect(@actual).to match(expected_json)
  end

  diffable
end
