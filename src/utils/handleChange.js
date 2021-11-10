const handleChange = function (e, reqData, fn) {
  const req = { ...reqData };

  if (e.target.name === "roleSelection") {
    req.role = e.target.value;
  } else if (e.target.name === "suit") {
    req.suit = e.target.value
  }
  else {
    req[e.target.id] = e.target.value;
  }
  // console.log(req)
  fn(req);
}

export default handleChange;